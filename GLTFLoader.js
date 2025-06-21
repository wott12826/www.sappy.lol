THREE.GLTFLoader = ( function () {

	function GLTFLoader( manager ) {

		THREE.Loader.call( this, manager );

		this.dracoLoader = null;
		this.ktx2Loader = null;
		this.meshoptDecoder = null;

		this.pluginCallbacks = [];

		this.register( function ( parser ) {

			return new GLTFMaterialsClearcoatExtension( parser );

		} );

		this.register( function ( parser ) {

			return new GLTFTextureTransformExtension( parser );

		} );

		this.register( function ( parser ) {

			return new GLTFMaterialsSheenExtension( parser );

		} );

		this.register( function ( parser ) {

			return new GLTFMaterialsTransmissionExtension( parser );

		} );

		this.register( function ( parser ) {

			return new GLTFMaterialsVolumeExtension( parser );

		} );

		this.register( function ( parser ) {

			return new GLTFMaterialsIorExtension( parser );

		} );

		this.register( function ( parser ) {

			return new GLTFMaterialsSpecularExtension( parser );

		} );

		this.register( function ( parser ) {

			return new GLTFMaterialsUnlitExtension( parser );

		} );

		this.register( function ( parser ) {

			return new GLTFLightsExtension( parser );

		} );

		this.register( function ( parser ) {

			return new GLTFMeshoptCompression( parser );

		} );

	}

	GLTFLoader.prototype = Object.assign( Object.create( THREE.Loader.prototype ), {

		constructor: GLTFLoader,

		load: function ( url, onLoad, onProgress, onError ) {

			var scope = this;

			var resourcePath;

			if ( this.resourcePath !== '' ) {

				resourcePath = this.resourcePath;

			} else if ( this.path !== '' ) {

				resourcePath = this.path;

			} else {

				resourcePath = THREE.LoaderUtils.extractUrlBase( url );

			}

			// Tells the LoadingManager to track an extra item, which resolves when
			// the model is fully loaded. This means the count of items loaded will
			// be incorrect, but ensures manager.onLoad() does not fire early.
			this.manager.itemStart( url );

			var _onError = function ( e ) {

				if ( onError ) {

					onError( e );

				} else {

					console.error( e );

				}

				scope.manager.itemError( url );
				scope.manager.itemEnd( url );

			};

			var loader = new THREE.FileLoader( this.manager );

			loader.setPath( this.path );
			loader.setResponseType( 'arraybuffer' );
			loader.setRequestHeader( this.requestHeader );
			loader.setWithCredentials( this.withCredentials );

			loader.load( url, function ( data ) {

				try {

					scope.parse( data, resourcePath, function ( gltf ) {

						onLoad( gltf );

						scope.manager.itemEnd( url );

					}, _onError );

				} catch ( e ) {

					_onError( e );

				}

			}, onProgress, _onError );

		},

		setDRACOLoader: function ( dracoLoader ) {

			this.dracoLoader = dracoLoader;
			return this;

		},

		setDDSLoader: function () {

			throw new Error( 'THREE.GLTFLoader: "setDDSLoader()" has been removed. Use "setKTX2Loader()" instead.' );

		},

		setKTX2Loader: function ( ktx2Loader ) {

			this.ktx2Loader = ktx2Loader;
			return this;

		},

		setMeshoptDecoder: function ( meshoptDecoder ) {

			this.meshoptDecoder = meshoptDecoder;
			return this;

		},

		register: function ( callback ) {

			if ( this.pluginCallbacks.indexOf( callback ) === - 1 ) {

				this.pluginCallbacks.push( callback );

			}

			return this;

		},

		unregister: function ( callback ) {

			if ( this.pluginCallbacks.indexOf( callback ) !== - 1 ) {

				this.pluginCallbacks.splice( this.pluginCallbacks.indexOf( callback ), 1 );

			}

			return this;

		},

		parse: function ( data, path, onLoad, onError ) {

			var content;
			var extensions = {};
			var plugins = {};

			if ( typeof data === 'string' ) {

				content = data;

			} else if ( data instanceof ArrayBuffer ) {

				var magic = THREE.LoaderUtils.decodeText( new Uint8Array( data, 0, 4 ) );

				if ( magic === BINARY_EXTENSION_HEADER_MAGIC ) {

					try {

						extensions[ EXTENSIONS.KHR_BINARY_GLTF ] = new GLTFBinaryExtension( data );

					} catch ( error ) {

						if ( onError ) onError( error );
						return;

					}

					content = extensions[ EXTENSIONS.KHR_BINARY_GLTF ].content;

				} else {

					content = THREE.LoaderUtils.decodeText( new Uint8Array( data ) );

				}

			} else {

				content = data;

			}

			var json = JSON.parse( content );

			if ( json.asset === undefined || json.asset.version[ 0 ] < 2 ) {

				if ( onError ) onError( new Error( 'THREE.GLTFLoader: Unsupported asset. glTF versions >=2.0 are supported.' ) );
				return;

			}

			var parser = new GLTFParser( json, {

				path: path || this.resourcePath || '',
				crossOrigin: this.crossOrigin,
				requestHeader: this.requestHeader,
				manager: this.manager,
				ktx2Loader: this.ktx2Loader,
				meshoptDecoder: this.meshoptDecoder

			} );

			parser.fileLoader.setRequestHeader( this.requestHeader );

			for ( var i = 0; i < this.pluginCallbacks.length; i ++ ) {

				var plugin = this.pluginCallbacks[ i ]( parser );
				plugins[ plugin.name ] = plugin;

				// Workaround to avoid determining plugin dependencies
				extensions[ plugin.name ] = true;

			}

			if ( json.extensionsUsed ) {

				for ( var i = 0; i < json.extensionsUsed.length; ++ i ) {

					var extensionName = json.extensionsUsed[ i ];
					var extensionsRequired = json.extensionsRequired || [];

					switch ( extensionName ) {

						case EXTENSIONS.KHR_MATERIALS_UNLIT:
							extensions[ extensionName ] = new GLTFMaterialsUnlitExtension();
							break;

						case EXTENSIONS.KHR_MATERIALS_PBR_SPECULAR_GLOSSINESS:
							extensions[ extensionName ] = new GLTFMaterialsPbrSpecularGlossinessExtension();
							break;

						case EXTENSIONS.KHR_DRACO_MESH_COMPRESSION:
							extensions[ extensionName ] = new GLTFDracoMeshCompressionExtension( json, this.dracoLoader );
							break;

						case EXTENSIONS.KHR_TEXTURE_TRANSFORM:
							extensions[ extensionName ] = new GLTFTextureTransformExtension();
							break;

						case EXTENSIONS.KHR_MESH_QUANTIZATION:
							extensions[ extensionName ] = new GLTFMeshQuantizationExtension();
							break;

						default:

							if ( extensionsRequired.indexOf( extensionName ) >= 0 && plugins[ extensionName ] === undefined ) {

								console.warn( 'THREE.GLTFLoader: Unknown extension "' + extensionName + '".' );

							}

					}

				}

			}

			parser.setExtensions( extensions );
			parser.setPlugins( plugins );
			parser.parse( onLoad, onError );

		}

	} );

	/* GLTFREGISTRY */

	function GLTFRegistry() {

		var objects = {};

		return {

			get: function ( key ) {

				return objects[ key ];

			},

			add: function ( key, object ) {

				objects[ key ] = object;

			},

			remove: function ( key ) {

				delete objects[ key ];

			},

			removeAll: function () {

				objects = {};

			}

		};

	}

	/*********************************/
	/********** EXTENSIONS ***********/
	/*********************************/

	var EXTENSIONS = {
		KHR_BINARY_GLTF: 'KHR_binary_glTF',
		KHR_DRACO_MESH_COMPRESSION: 'KHR_draco_mesh_compression',
		KHR_LIGHTS_PUNCTUAL: 'KHR_lights_punctual',
		KHR_MATERIALS_CLEARCOAT: 'KHR_materials_clearcoat',
		KHR_MATERIALS_IOR: 'KHR_materials_ior',
		KHR_MATERIALS_PBR_SPECULAR_GLOSSINESS: 'KHR_materials_pbrSpecularGlossiness',
		KHR_MATERIALS_SHEEN: 'KHR_materials_sheen',
		KHR_MATERIALS_SPECULAR: 'KHR_materials_specular',
		KHR_MATERIALS_TRANSMISSION: 'KHR_materials_transmission',
		KHR_MATERIALS_UNLIT: 'KHR_materials_unlit',
		KHR_MATERIALS_VOLUME: 'KHR_materials_volume',
		KHR_TEXTURE_BASISU: 'KHR_texture_basisu',
		KHR_TEXTURE_TRANSFORM: 'KHR_texture_transform',
		KHR_MESH_QUANTIZATION: 'KHR_mesh_quantization',
		EXT_MESHOPT_COMPRESSION: 'EXT_meshopt_compression',
		EXT_TEXTURE_WEBP: 'EXT_texture_webp'
	};

	/**
	 * Punctual Lights Extension
	 *
	 * Specification: https://github.com/KhronosGroup/glTF/tree/master/extensions/2.0/Khronos/KHR_lights_punctual
	 */
	function GLTFLightsExtension( parser ) {

		this.parser = parser;
		this.name = EXTENSIONS.KHR_LIGHTS_PUNCTUAL;

		// Object3D instance caches
		this.cache = { refs: {}, uses: {} };

	}

	GLTFLightsExtension.prototype.getRawLights = function () {

		return this.parser.json.extensions[ this.name ].lights;

	};

	GLTFLightsExtension.prototype._createLight = function ( lightIndex ) {

		var parser = this.parser;
		var cacheKey = 'light:' + lightIndex;
		var dependency = parser.cache.get( cacheKey );

		if ( dependency ) return dependency;

		var json = parser.json;
		var extensions = ( json.extensions && json.extensions[ this.name ] ) || {};
		var lightDefs = extensions.lights || [];
		var lightDef = lightDefs[ lightIndex ];
		var lightNode;

		var color = new THREE.Color( 0xffffff );
		if ( lightDef.color !== undefined ) color.fromArray( lightDef.color );

		var intensity = ( lightDef.intensity !== undefined ) ? lightDef.intensity : 1;

		switch ( lightDef.type ) {

			case 'directional':
				lightNode = new THREE.DirectionalLight( color, intensity );
				lightNode.target.position.set( 0, 0, - 1 );
				lightNode.add( lightNode.target );
				break;

			case 'point':
				lightNode = new THREE.PointLight( color, intensity );
				break;

			case 'spot':
				lightNode = new THREE.SpotLight( color, intensity );
				lightNode.position.set( 0, 0, 1 );
				lightNode.target.position.set( 0, 0, - 1 );
				lightNode.add( lightNode.target );
				break;

			default:
				throw new Error( 'THREE.GLTFLoader: Unexpected light type: ' + lightDef.type );

		}

		// Several lights may share a same name in a glTF file.
		lightNode.name = parser.createUniqueName( lightDef.name || ( 'light_' + lightIndex ) );

		if ( lightDef.range !== undefined ) lightNode.distance = lightDef.range;

		if ( lightDef.spot !== undefined ) {

			lightNode.angle = ( lightDef.spot.outerConeAngle !== undefined ) ? lightDef.spot.outerConeAngle : Math.PI / 4.0;
			lightNode.penumbra = ( lightDef.spot.innerConeAngle !== undefined ) ? 1.0 - lightDef.spot.innerConeAngle / lightNode.angle : 0.0;

		}

		parser.cache.add( cacheKey, lightNode );

		return lightNode;

	};

	GLTFLightsExtension.prototype.createNodeAttachment = function ( nodeIndex ) {

		var self = this;
		var parser = this.parser;
		var json = parser.json;
		var nodeDef = json.nodes[ nodeIndex ];
		var lightDef = ( nodeDef.extensions && nodeDef.extensions[ this.name ] ) || {};
		var lightIndex = lightDef.light;

		if ( lightIndex === undefined ) return null;

		return new Promise( function ( resolve ) {

			resolve( self._createLight( lightIndex ) );

		} );

	};

	/**
	 * Unlit Materials Extension
	 *
	 * Specification: https://github.com/KhronosGroup/glTF/tree/master/extensions/2.0/Khronos/KHR_materials_unlit
	 */
	function GLTFMaterialsUnlitExtension() {

		this.name = EXTENSIONS.KHR_MATERIALS_UNLIT;

	}

	GLTFMaterialsUnlitExtension.prototype.getMaterialType = function () {

		return THREE.MeshBasicMaterial;

	};

	GLTFMaterialsUnlitExtension.prototype.extendParams = function ( materialParams, materialDef, parser ) {

		var pending = [];

		materialParams.color = new THREE.Color( 1.0, 1.0, 1.0 );
		materialParams.opacity = 1.0;

		var metallicRoughness = materialDef.pbrMetallicRoughness;

		if ( metallicRoughness ) {

			if ( Array.isArray( metallicRoughness.baseColorFactor ) ) {

				var array = metallicRoughness.baseColorFactor;

				materialParams.color.fromArray( array );
				materialParams.opacity = array[ 3 ];

			}

			if ( metallicRoughness.baseColorTexture !== undefined ) {

				pending.push( parser.assignTexture( materialParams, 'map', metallicRoughness.baseColorTexture ) );

			}

		}

		return Promise.all( pending );

	};

	/**
	 * Clearcoat Materials Extension
	 *
	 * Specification: https://github.com/KhronosGroup/glTF/tree/master/extensions/2.0/Khronos/KHR_materials_clearcoat
	 */
	function GLTFMaterialsClearcoatExtension( parser ) {

		this.parser = parser;
		this.name = EXTENSIONS.KHR_MATERIALS_CLEARCOAT;

	}

	GLTFMaterialsClearcoatExtension.prototype.getMaterialType = function ( materialIndex ) {

		var parser = this.parser;
		var materialDef = parser.json.materials[ materialIndex ];

		if ( ! materialDef.extensions || ! materialDef.extensions[ this.name ] ) return null;

		return THREE.MeshPhysicalMaterial;

	};

	GLTFMaterialsClearcoatExtension.prototype.extendMaterialParams = function ( materialIndex, materialParams ) {

		var parser = this.parser;
		var materialDef = parser.json.materials[ materialIndex ];

		if ( ! materialDef.extensions || ! materialDef.extensions[ this.name ] ) {

			return Promise.resolve();

		}

		var pending = [];

		var extension = materialDef.extensions[ this.name ];

		if ( extension.clearcoatFactor !== undefined ) {

			materialParams.clearcoat = extension.clearcoatFactor;

		}

		if ( extension.clearcoatTexture !== undefined ) {

			pending.push( parser.assignTexture( materialParams, 'clearcoatMap', extension.clearcoatTexture ) );

		}

		if ( extension.clearcoatRoughnessFactor !== undefined ) {

			materialParams.clearcoatRoughness = extension.clearcoatRoughnessFactor;

		}

		if ( extension.clearcoatRoughnessTexture !== undefined ) {

			pending.push( parser.assignTexture( materialParams, 'clearcoatRoughnessMap', extension.clearcoatRoughnessTexture ) );

		}

		if ( extension.clearcoatNormalTexture !== undefined ) {

			pending.push( parser.assignTexture( materialParams, 'clearcoatNormalMap', extension.clearcoatNormalTexture ) );

			if ( extension.clearcoatNormalTexture.scale !== undefined ) {

				var scale = extension.clearcoatNormalTexture.scale;

				materialParams.clearcoatNormalScale = new THREE.Vector2( scale, scale );

			}

		}

		return Promise.all( pending );

	};

	/**
	 * Sheen Materials Extension
	 *
	 * Specification: https://github.com/KhronosGroup/glTF/tree/main/extensions/2.0/Khronos/KHR_materials_sheen
	 */
	function GLTFMaterialsSheenExtension( parser ) {

		this.parser = parser;
		this.name = EXTENSIONS.KHR_MATERIALS_SHEEN;

	}

	GLTFMaterialsSheenExtension.prototype.getMaterialType = function ( materialIndex ) {

		var parser = this.parser;
		var materialDef = parser.json.materials[ materialIndex ];

		if ( ! materialDef.extensions || ! materialDef.extensions[ this.name ] ) return null;

		return THREE.MeshPhysicalMaterial;

	};

	GLTFMaterialsSheenExtension.prototype.extendMaterialParams = function ( materialIndex, materialParams ) {

		var parser = this.parser;
		var materialDef = parser.json.materials[ materialIndex ];

		if ( ! materialDef.extensions || ! materialDef.extensions[ this.name ] ) {

			return Promise.resolve();

		}

		var pending = [];

		materialParams.sheenColor = new THREE.Color( 0, 0, 0 );
		materialParams.sheenRoughness = 0;
		materialParams.sheen = 1;

		var extension = materialDef.extensions[ this.name ];

		if ( extension.sheenColorFactor !== undefined ) {

			materialParams.sheenColor.fromArray( extension.sheenColorFactor );

		}

		if ( extension.sheenColorTexture !== undefined ) {

			pending.push( parser.assignTexture( materialParams, 'sheenColorMap', extension.sheenColorTexture ) );

		}

		if ( extension.sheenRoughnessFactor !== undefined ) {

			materialParams.sheenRoughness = extension.sheenRoughnessFactor;

		}

		if ( extension.sheenRoughnessTexture !== undefined ) {

			pending.push( parser.assignTexture( materialParams, 'sheenRoughnessMap', extension.sheenRoughnessTexture ) );

		}

		return Promise.all( pending );

	};

	/**
	 * Transmission Materials Extension
	 *
	 * Specification: https://github.com/KhronosGroup/glTF/tree/master/extensions/2.0/Khronos/KHR_materials_transmission
	 */
	function GLTFMaterialsTransmissionExtension( parser ) {

		this.parser = parser;
		this.name = EXTENSIONS.KHR_MATERIALS_TRANSMISSION;

	}

	GLTFMaterialsTransmissionExtension.prototype.getMaterialType = function ( materialIndex ) {

		var parser = this.parser;
		var materialDef = parser.json.materials[ materialIndex ];

		if ( ! materialDef.extensions || ! materialDef.extensions[ this.name ] ) return null;

		return THREE.MeshPhysicalMaterial;

	};

	GLTFMaterialsTransmissionExtension.prototype.extendMaterialParams = function ( materialIndex, materialParams ) {

		var parser = this.parser;
		var materialDef = parser.json.materials[ materialIndex ];

		if ( ! materialDef.extensions || ! materialDef.extensions[ this.name ] ) {

			return Promise.resolve();

		}

		var pending = [];

		var extension = materialDef.extensions[ this.name ];

		if ( extension.transmissionFactor !== undefined ) {

			materialParams.transmission = extension.transmissionFactor;

		}

		if ( extension.transmissionTexture !== undefined ) {

			pending.push( parser.assignTexture( materialParams, 'transmissionMap', extension.transmissionTexture ) );

		}

		return Promise.all( pending );

	};

	/**
	 * Materials Volume Extension
	 *
	 * Specification: https://github.com/KhronosGroup/glTF/tree/master/extensions/2.0/Khronos/KHR_materials_volume
	 */
	function GLTFMaterialsVolumeExtension( parser ) {

		this.parser = parser;
		this.name = EXTENSIONS.KHR_MATERIALS_VOLUME;

	}

	GLTFMaterialsVolumeExtension.prototype.getMaterialType = function ( materialIndex ) {

		var parser = this.parser;
		var materialDef = parser.json.materials[ materialIndex ];

		if ( ! materialDef.extensions || ! materialDef.extensions[ this.name ] ) return null;

		return THREE.MeshPhysicalMaterial;

	};

	GLTFMaterialsVolumeExtension.prototype.extendMaterialParams = function ( materialIndex, materialParams ) {

		var parser = this.parser;
		var materialDef = parser.json.materials[ materialIndex ];

		if ( ! materialDef.extensions || ! materialDef.extensions[ this.name ] ) {

			return Promise.resolve();

		}

		var pending = [];

		var extension = materialDef.extensions[ this.name ];

		materialParams.thickness = extension.thicknessFactor !== undefined ? extension.thicknessFactor : 0;

		if ( extension.thicknessTexture !== undefined ) {

			pending.push( parser.assignTexture( materialParams, 'thicknessMap', extension.thicknessTexture ) );

		}

		materialParams.attenuationDistance = extension.attenuationDistance || 0;

		var colorArray = extension.attenuationColor || [ 1, 1, 1 ];
		materialParams.attenuationColor = new THREE.Color( colorArray[ 0 ], colorArray[ 1 ], colorArray[ 2 ] );

		return Promise.all( pending );

	};

	/**
	 * Materials ior Extension
	 *
	 * Specification: https://github.com/KhronosGroup/glTF/tree/master/extensions/2.0/Khronos/KHR_materials_ior
	 */
	function GLTFMaterialsIorExtension( parser ) {

		this.parser = parser;
		this.name = EXTENSIONS.KHR_MATERIALS_IOR;

	}

	GLTFMaterialsIorExtension.prototype.getMaterialType = function ( materialIndex ) {

		var parser = this.parser;
		var materialDef = parser.json.materials[ materialIndex ];

		if ( ! materialDef.extensions || ! materialDef.extensions[ this.name ] ) return null;

		return THREE.MeshPhysicalMaterial;

	};

	GLTFMaterialsIorExtension.prototype.extendMaterialParams = function ( materialIndex, materialParams ) {

		var parser = this.parser;
		var materialDef = parser.json.materials[ materialIndex ];

		if ( ! materialDef.extensions || ! materialDef.extensions[ this.name ] ) {

			return Promise.resolve();

		}

		var extension = materialDef.extensions[ this.name ];

		materialParams.ior = extension.ior !== undefined ? extension.ior : 1.5;

		return Promise.resolve();

	};

	/**
	 * Materials specular Extension
	 *
	 * Specification: https://github.com/KhronosGroup/glTF/tree/master/extensions/2.0/Khronos/KHR_materials_specular
	 */
	function GLTFMaterialsSpecularExtension( parser ) {

		this.parser = parser;
		this.name = EXTENSIONS.KHR_MATERIALS_SPECULAR;

	}

	GLTFMaterialsSpecularExtension.prototype.getMaterialType = function ( materialIndex ) {

		var parser = this.parser;
		var materialDef = parser.json.materials[ materialIndex ];

		if ( ! materialDef.extensions || ! materialDef.extensions[ this.name ] ) return null;

		return THREE.MeshPhysicalMaterial;

	};

	GLTFMaterialsSpecularExtension.prototype.extendMaterialParams = function ( materialIndex, materialParams ) {

		var parser = this.parser;
		var materialDef = parser.json.materials[ materialIndex ];

		if ( ! materialDef.extensions || ! materialDef.extensions[ this.name ] ) {

			return Promise.resolve();

		}

		var pending = [];

		var extension = materialDef.extensions[ this.name ];

		materialParams.specularIntensity = extension.specularFactor !== undefined ? extension.specularFactor : 1.0;

		if ( extension.specularTexture !== undefined ) {

			pending.push( parser.assignTexture( materialParams, 'specularIntensityMap', extension.specularTexture ) );

		}

		var colorArray = extension.specularColorFactor || [ 1, 1, 1 ];
		materialParams.specularColor = new THREE.Color( colorArray[ 0 ], colorArray[ 1 ], colorArray[ 2 ] );

		if ( extension.specularColorTexture !== undefined ) {

			pending.push( parser.assignTexture( materialParams, 'specularColorMap', extension.specularColorTexture ) );

		}

		return Promise.all( pending );

	};

	/**
	 * BasisU Texture Extension
	 *
	 * Specification: https://github.com/KhronosGroup/glTF/tree/master/extensions/2.0/Khronos/KHR_texture_basisu
	 */
	function GLTFTextureBasisUExtension( parser ) {

		this.parser = parser;
		this.name = EXTENSIONS.KHR_TEXTURE_BASISU;

	}

	GLTFTextureBasisUExtension.prototype.loadTexture = function ( textureIndex ) {

		var parser = this.parser;
		var json = parser.json;

		var textureDef = json.textures[ textureIndex ];

		if ( ! textureDef.extensions || ! textureDef.extensions[ this.name ] ) {

			return null;

		}

		var extension = textureDef.extensions[ this.name ];
		var loader = parser.options.ktx2Loader;

		if ( ! loader ) {

			if ( json.extensionsRequired && json.extensionsRequired.indexOf( this.name ) >= 0 ) {

				throw new Error( 'THREE.GLTFLoader: setKTX2Loader must be called before loading KTX2 textures' );

			} else {

				// Assumes that the extension is optional and that a fallback texture is present
				return null;

			}

		}

		return parser.loadTextureImage( textureIndex, extension.source, loader );

	};

	/**
	 * WebP Texture Extension
	 *
	 * Specification: https://github.com/KhronosGroup/glTF/tree/master/extensions/2.0/Vendor/EXT_texture_webp
	 */
	function GLTFTextureWebPExtension( parser ) {

		this.parser = parser;
		this.name = EXTENSIONS.EXT_TEXTURE_WEBP;
		this.isSupported = null;

	}

	GLTFTextureWebPExtension.prototype.loadTexture = function ( textureIndex ) {

		var name = this.name;
		var parser = this.parser;
		var json = parser.json;

		var textureDef = json.textures[ textureIndex ];

		if ( ! textureDef.extensions || ! textureDef.extensions[ name ] ) {

			return null;

		}

		var extension = textureDef.extensions[ name ];
		var source = json.images[ extension.source ];
		var loader = source.uri ? parser.options.manager.getHandler( source.uri ) : parser.fileLoader;

		return this.detectSupport().then( function ( isSupported ) {

			if ( isSupported ) return parser.loadTextureImage( textureIndex, extension.source, loader );

			if ( json.extensionsRequired && json.extensionsRequired.indexOf( name ) >= 0 ) {

				throw new Error( 'THREE.GLTFLoader: WebP required by asset but unsupported.' );

			}

			// Fallback texture required by glTF spec.
			return parser.loadTexture( textureDef.source );

		} );

	};

	GLTFTextureWebPExtension.prototype.detectSupport = function () {

		if ( ! this.isSupported ) {

			this.isSupported = new Promise( function ( resolve ) {

				var image = new Image();

				// Lossy test image. Support for lossy images doesn't guarantee support for all webp features, unfortunately.
				image.src = 'data:image/webp;base64,UklGRiIAAABXRUJQVlA4IBYAAAAwAQCdASoBAAEADsD+JaQAA3AAAAAA';

				image.onload = image.onerror = function () {

					resolve( image.height === 1 );

				};

			} );

		}

		return this.isSupported;

	};

	/**
	 * meshopt BufferView Compression Extension
	 *
	 * Specification: https://github.com/KhronosGroup/glTF/tree/master/extensions/2.0/Vendor/EXT_meshopt_compression
	 */
	function GLTFMeshoptCompression( parser ) {

		this.name = EXTENSIONS.EXT_MESHOPT_COMPRESSION;
		this.parser = parser;

	}

	GLTFMeshoptCompression.prototype.loadBufferView = function ( index ) {

		var json = this.parser.json;
		var bufferView = json.bufferViews[ index ];

		if ( bufferView.extensions && bufferView.extensions[ this.name ] ) {

			var extensionDef = bufferView.extensions[ this.name ];

			var buffer = this.parser.getDependency( 'buffer', extensionDef.buffer );
			var decoder = this.parser.options.meshoptDecoder;

			if ( ! decoder || ! decoder.supported ) {

				if ( json.extensionsRequired && json.extensionsRequired.indexOf( this.name ) >= 0 ) {

					throw new Error( 'THREE.GLTFLoader: setMeshoptDecoder must be called before loading compressed mesh data' );

				} else {

					// Assumes that the extension is optional and that fallback buffer data is present
					return null;

				}

			}

			return Promise.all( [ buffer, decoder.ready ] ).then( function ( res ) {

				var byteOffset = extensionDef.byteOffset || 0;
				var byteLength = extensionDef.byteLength || 0;

				var count = extensionDef.count;
				var stride = extensionDef.byteStride;

				var result = new ArrayBuffer( count * stride );
				var source = new Uint8Array( res[ 0 ], byteOffset, byteLength );

				decoder.decodeGltfBuffer( new Uint8Array( result ), count, stride, source, extensionDef.mode, extensionDef.filter );
				return result;

			} );

		} else {

			return null;

		}

	};

	/* BINARY EXTENSION */
	var BINARY_EXTENSION_HEADER_MAGIC = 'glTF';
	var BINARY_EXTENSION_HEADER_LENGTH = 12;
	var BINARY_EXTENSION_CHUNK_TYPES = { JSON: 0x4E4F534A, BIN: 0x004E4942 };

	function GLTFBinaryExtension( data ) {

		this.name = EXTENSIONS.KHR_BINARY_GLTF;
		this.content = null;
		this.body = null;

		var headerView = new DataView( data, 0, BINARY_EXTENSION_HEADER_LENGTH );

		this.header = {
			magic: THREE.LoaderUtils.decodeText( new Uint8Array( data.slice( 0, 4 ) ) ),
			version: headerView.getUint32( 4, true ),
			length: headerView.getUint32( 8, true )
		};

		if ( this.header.magic !== BINARY_EXTENSION_HEADER_MAGIC ) {

			throw new Error( 'THREE.GLTFLoader: Unsupported glTF-Binary header.' );

		} else if ( this.header.version < 2.0 ) {

			throw new Error( 'THREE.GLTFLoader: Legacy binary file detected. Use GLTFLoader instead.' );

		}

		var chunkContentsLength = this.header.length - BINARY_EXTENSION_HEADER_LENGTH;
		var chunkView = new DataView( data, BINARY_EXTENSION_HEADER_LENGTH );
		var chunkIndex = 0;

		while ( chunkIndex < chunkContentsLength ) {

			var chunkLength = chunkView.getUint32( chunkIndex, true );
			chunkIndex += 4;

			var chunkType = chunkView.getUint32( chunkIndex, true );
			chunkIndex += 4;

			if ( chunkType === BINARY_EXTENSION_CHUNK_TYPES.JSON ) {

				var contentArray = new Uint8Array( data, BINARY_EXTENSION_HEADER_LENGTH + chunkIndex, chunkLength );
				this.content = THREE.LoaderUtils.decodeText( contentArray );

			} else if ( chunkType === BINARY_EXTENSION_CHUNK_TYPES.BIN ) {

				var byteOffset = BINARY_EXTENSION_HEADER_LENGTH + chunkIndex;
				this.body = data.slice( byteOffset, byteOffset + chunkLength );

			}

			// Clients must ignore chunks with unknown types.

			chunkIndex += chunkLength;

		}

		if ( this.content === null ) {

			throw new Error( 'THREE.GLTFLoader: JSON content not found.' );

		}

	}

	/**
	 * DRACO Mesh Compression Extension
	 *
	 * Specification: https://github.com/KhronosGroup/glTF/tree/master/extensions/2.0/Khronos/KHR_draco_mesh_compression
	 */
	function GLTFDracoMeshCompressionExtension( json, dracoLoader ) {

		if ( ! dracoLoader ) {

			throw new Error( 'THREE.GLTFLoader: No DRACOLoader instance provided.' );

		}

		this.name = EXTENSIONS.KHR_DRACO_MESH_COMPRESSION;
		this.json = json;
		this.dracoLoader = dracoLoader;

	}

	GLTFDracoMeshCompressionExtension.prototype.decodePrimitive = function ( primitive, parser ) {

		var json = this.json;
		var dracoLoader = this.dracoLoader;
		var bufferViewIndex = primitive.extensions[ this.name ].bufferView;
		var gltfAttributeMap = primitive.extensions[ this.name ].attributes;
		var threeAttributeMap = {};
		var attributeNormalizedMap = {};
		var attributeTypeMap = {};

		for ( var attributeName in gltfAttributeMap ) {

			var threeAttributeName = ATTRIBUTES[ attributeName ] || attributeName.toLowerCase();

			threeAttributeMap[ threeAttributeName ] = gltfAttributeMap[ attributeName ];

		}

		for ( attributeName in primitive.attributes ) {

			var threeAttributeName = ATTRIBUTES[ attributeName ] || attributeName.toLowerCase();

			if ( gltfAttributeMap[ attributeName ] !== undefined ) {

				var accessorDef = json.accessors[ primitive.attributes[ attributeName ] ];
				var componentType = WEBGL_COMPONENT_TYPES[ accessorDef.componentType ];

				attributeTypeMap[ threeAttributeName ] = componentType;
				attributeNormalizedMap[ threeAttributeName ] = accessorDef.normalized === true;

			}

		}

		return parser.getDependency( 'bufferView', bufferViewIndex ).then( function ( bufferView ) {

			return new Promise( function ( resolve ) {

				dracoLoader.decodeDracoFile( bufferView, function ( geometry ) {

					for ( var attributeName in geometry.attributes ) {

						var attribute = geometry.attributes[ attributeName ];
						var normalized = attributeNormalizedMap[ attributeName ];

						if ( normalized !== undefined ) attribute.normalized = normalized;

					}

					resolve( geometry );

				}, threeAttributeMap, attributeTypeMap );

			} );

		} );

	};

	/**
	 * Texture Transform Extension
	 *
	 * Specification: https://github.com/KhronosGroup/glTF/tree/master/extensions/2.0/Khronos/KHR_texture_transform
	 */
	function GLTFTextureTransformExtension() {

		this.name = EXTENSIONS.KHR_TEXTURE_TRANSFORM;

	}

	GLTFTextureTransformExtension.prototype.extendTexture = function ( texture, transform ) {

		texture = texture.clone();

		if ( transform.offset !== undefined ) {

			texture.offset.fromArray( transform.offset );

		}

		if ( transform.rotation !== undefined ) {

			texture.rotation = transform.rotation;

		}

		if ( transform.scale !== undefined ) {

			texture.repeat.fromArray( transform.scale );

		}

		if ( transform.texCoord !== undefined ) {

			console.warn( 'THREE.GLTFLoader: Custom UV sets in "' + this.name + '" extension not yet supported.' );

		}

		texture.needsUpdate = true;

		return texture;

	};

	/**
	 * Specular-Glossiness Extension
	 *
	 * Specification: https://github.com/KhronosGroup/glTF/tree/main/extensions/2.0/Archived/KHR_materials_pbrSpecularGlossiness
	 */

	/**
	 * A sub class of StandardMaterial with some of the functionality
	 * changed via the `onBeforeCompile` callback
	 * @pailhead
	 */
	function GLTFMeshStandardSGMaterial( params ) {

		THREE.MeshStandardMaterial.call( this );

		this.isGLTFSpecularGlossinessMaterial = true;

		//various chunks that need to be altered
		var specularMapParsFragmentChunk = [
			'#ifdef USE_SPECULARMAP',
			'	uniform sampler2D specularMap;',
			'#endif'
		].join( '\n' );

		var glossinessMapParsFragmentChunk = [
			'#ifdef USE_GLOSSINESSMAP',
			'	uniform sampler2D glossinessMap;',
			'#endif'
		].join( '\n' );

		var specularMapFragmentChunk = [
			'vec3 specularFactor = specular;',
			'#ifdef USE_SPECULARMAP',
			'	vec4 texelSpecular = texture2D( specularMap, vUv );',
			'	texelSpecular = sRGBToLinear( texelSpecular );',
			'	// reads channel RGB, compatible with a glTF Specular-Glossiness (RGBA) texture',
			'	specularFactor *= texelSpecular.rgb;',
			'#endif'
		].join( '\n' );

		var glossinessMapFragmentChunk = [
			'float glossinessFactor = glossiness;',
			'#ifdef USE_GLOSSINESSMAP',
			'	vec4 texelGlossiness = texture2D( glossinessMap, vUv );',
			'	// reads channel A, compatible with a glTF Specular-Glossiness (RGBA) texture',
			'	glossinessFactor *= texelGlossiness.a;',
			'#endif'
		].join( '\n' );

		var lightPhysicalFragmentChunk = [
			'PhysicalMaterial material;',
			'material.diffuseColor = diffuseColor.rgb * ( 1. - specularFactor );',
			'vec3 dxy = max( abs( dFdx( geometryNormal ) ), abs( dFdy( geometryNormal ) ) );',
			'float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );',
			'material.specularRoughness = max( 1.0 - glossinessFactor, 0.0525 ); // 0.0525 corresponds to the base mip of a 256 cubemap.',
			'material.specularRoughness += geometryRoughness;',
			'material.specularColor = specularFactor;',
		].join( '\n' );

		var uniforms = {
			specular: { value: new THREE.Color().setHex( 0xffffff ) },
			glossiness: { value: 1 },
			specularMap: { value: null },
			glossinessMap: { value: null }
		};

		this._extraUniforms = uniforms;

		this.onBeforeCompile = function ( shader ) {

			for ( var uniform in uniforms ) {

				shader.uniforms[ uniform ] = uniforms[ uniform ];

			}

			shader.fragmentShader = shader.fragmentShader
				.replace( 'uniform float roughness;', 'uniform float roughness; uniform float glossiness;' )
				.replace( 'uniform vec3 specular;', 'uniform vec3 specular; uniform vec3 specular;' )
				.replace( '#include <specularmap_pars_fragment>', specularMapParsFragmentChunk )
				.replace( '#include <roughnessmap_pars_fragment>', glossinessMapParsFragmentChunk )
				.replace( '#include <specularmap_fragment>', specularMapFragmentChunk )
				.replace( '#include <roughnessmap_fragment>', glossinessMapFragmentChunk )
				.replace( '#include <light_physical_fragment>', lightPhysicalFragmentChunk );

		};

		Object.defineProperties( this, {

			specular: {
				get: function () {

					return uniforms.specular.value;

				},
				set: function ( v ) {

					uniforms.specular.value = v;

				}
			},

			specularMap: {
				get: function () {

					return uniforms.specularMap.value;

				},
				set: function ( v ) {

					uniforms.specularMap.value = v;

					if ( v ) {

						this.defines.USE_SPECULARMAP = ''; // USE_SPECULARMAP is non-standard and needed for SG material

					} else {

						delete this.defines.USE_SPECULARMAP;

					}

				}
			},

			glossiness: {
				get: function () {

					return uniforms.glossiness.value;

				},
				set: function ( v ) {

					uniforms.glossiness.value = v;

				}
			},

			glossinessMap: {
				get: function () {

					return uniforms.glossinessMap.value;

				},
				set: function ( v ) {

					uniforms.glossinessMap.value = v;

					if ( v ) {

						this.defines.USE_GLOSSINESSMAP = ''; // USE_GLOSSINESSMAP is non-standard and needed for SG material
						this.defines.USE_ROUGHNESSMAP = ''; // workaround is to use USE_ROUGHNESSMAP

					} else {

						delete this.defines.USE_GLOSSINESSMAP;
						delete this.defines.USE_ROUGHNESSMAP;

					}

				}
			}

		} );

		delete this.roughness;
		delete this.roughnessMap;
		delete this.metalness;
		delete this.metalnessMap;

		this.setValues( params );

	}

	GLTFMeshStandardSGMaterial.prototype = Object.create( THREE.MeshStandardMaterial.prototype );
	GLTFMeshStandardSGMaterial.prototype.constructor = GLTFMeshStandardSGMaterial;

	GLTFMeshStandardSGMaterial.prototype.copy = function ( source ) {

		THREE.MeshStandardMaterial.prototype.copy.call( this, source );
		this.specular.copy( source.specular );
		this.specularMap = source.specularMap;
		this.glossiness = source.glossiness;
		this.glossinessMap = source.glossinessMap;
		delete this.roughness;
		delete this.roughnessMap;
		delete this.metalness;
		delete this.metalnessMap;
		return this;

	};

	function GLTFMaterialsPbrSpecularGlossinessExtension() {

		return {

			name: EXTENSIONS.KHR_MATERIALS_PBR_SPECULAR_GLOSSINESS,

			specularGlossinessParams: [
				'specularFactor',
				'specularTexture',
				'glossinessFactor',
				'glossinessTexture'
			],

			getMaterialType: function () {

				return GLTFMeshStandardSGMaterial;

			},

			extendParams: function ( params, materialDef, parser ) {

				var pbrSpecularGlossiness = materialDef.extensions[ this.name ];

				params.color = new THREE.Color( 1.0, 1.0, 1.0 );
				params.opacity = 1.0;

				var pending = [];

				if ( Array.isArray( materialDef.pbrMetallicRoughness.baseColorFactor ) ) {

					var array = materialDef.pbrMetallicRoughness.baseColorFactor;
					params.color.fromArray( array );
					params.opacity = array[ 3 ];

				}

				if ( materialDef.pbrMetallicRoughness.baseColorTexture !== undefined ) {

					pending.push( parser.assignTexture( params, 'map', materialDef.pbrMetallicRoughness.baseColorTexture ) );

				}

				params.specular = new THREE.Color( 1.0, 1.0, 1.0 );
				params.glossiness = 1.0;

				if ( Array.isArray( pbrSpecularGlossiness.specularFactor ) ) {

					params.specular.fromArray( pbrSpecularGlossiness.specularFactor );

				}

				if ( Array.isArray( pbrSpecularGlossiness.diffuseFactor ) ) {

					params.color.fromArray( pbrSpecularGlossiness.diffuseFactor );
					params.opacity = pbrSpecularGlossiness.diffuseFactor[ 3 ];

				}

				if ( pbrSpecularGlossiness.diffuseTexture !== undefined ) {

					pending.push( parser.assignTexture( params, 'map', pbrSpecularGlossiness.diffuseTexture ) );

				}

				if ( pbrSpecularGlossiness.specularGlossinessTexture !== undefined ) {

					pending.push( parser.assignTexture( params, 'specularMap', pbrSpecularGlossiness.specularGlossinessTexture ) );
					pending.push( parser.assignTexture( params, 'glossinessMap', pbrSpecularGlossiness.specularGlossinessTexture ) );

				}

				return Promise.all( pending );

			}

		};

	}

	/**
	 * Mesh Quantization Extension
	 *
	 * Specification: https://github.com/KhronosGroup/glTF/tree/master/extensions/2.0/Khronos/KHR_mesh_quantization
	 */
	function GLTFMeshQuantizationExtension() {

		this.name = EXTENSIONS.KHR_MESH_QUANTIZATION;

	}

	/*********************************/
	/********** INTERPOLATION ********/
	/*********************************/

	// Spline Interpolation
	// Specification: https://github.com/KhronosGroup/glTF/blob/master/specification/2.0/README.md#appendix-c-spline-interpolation
	function GLTFCubicSplineInterpolant( parameterPositions, sampleValues, sampleSize, resultBuffer ) {

		THREE.Interpolant.call( this, parameterPositions, sampleValues, sampleSize, resultBuffer );

	}

	GLTFCubicSplineInterpolant.prototype = Object.create( THREE.Interpolant.prototype );
	GLTFCubicSplineInterpolant.prototype.constructor = GLTFCubicSplineInterpolant;

	GLTFCubicSplineInterpolant.prototype.interpolate_ = function ( i1, t0, t, t1 ) {

		var result = this.resultBuffer;
		var values = this.sampleValues;
		var stride = this.valueSize;

		var stride2 = stride * 2;
		var stride3 = stride * 3;

		var td = t1 - t0;

		var p = ( t - t0 ) / td;
		var pp = p * p;
		var ppp = pp * p;

		var s2 = - 2 * ppp + 3 * pp;
		var s3 = ppp - pp;
		var s0 = 1 - s2;
		var s1 = s3 - pp + p;

		// Layout of keyframe data for CUBICSPLINE animations is
		//   [ inTangent_1, point_1, outTangent_1, inTangent_2, point_2, outTangent_2, ... ]
		for ( var i = 0; i !== stride; i ++ ) {

			var p0 = values[ ( i1 - 1 ) * stride3 + i + stride ]; // point_0
			var m0 = values[ ( i1 - 1 ) * stride3 + i + stride2 ] * td; // outTangent_0
			var p1 = values[ i1 * stride3 + i + stride ]; // point_1
			var m1 = values[ i1 * stride3 + i ] * td; // inTangent_1

			result[ i ] = s0 * p0 + s1 * m0 + s2 * p1 + s3 * m1;

		}

		return result;

	};

	/*********************************/
	/********** INTERNALS ************/
	/*********************************/

	/* CONSTANTS */

	var WEBGL_CONSTANTS = {
		34963: THREE.ElementArrayUsage,

		// Texel Encodings
		// https://www.khronos.org/registry/webgl/specs/latest/1.0/#5.14
		35907: THREE.sRGBEncoding,

		// Sampler Texture Filter
		9728: THREE.NearestFilter,
		9729: THREE.LinearFilter,
		9984: THREE.NearestMipmapNearestFilter,
		9985: THREE.LinearMipmapNearestFilter,
		9986: THREE.NearestMipmapLinearFilter,
		9987: THREE.LinearMipmapLinearFilter,

		// Sampler Texture Wrap
		33071: THREE.ClampToEdgeWrapping,
		33648: THREE.MirroredRepeatWrapping,
		10497: THREE.RepeatWrapping
	};

	var WEBGL_COMPONENT_TYPES = {
		5120: Int8Array,
		5121: Uint8Array,
		5122: Int16Array,
		5123: Uint16Array,
		5125: Uint32Array,
		5126: Float32Array
	};

	var WEBGL_FILTERS = {
		9728: THREE.NearestFilter,
		9729: THREE.LinearFilter,
		9984: THREE.NearestMipmapNearestFilter,
		9985: THREE.LinearMipmapNearestFilter,
		9986: THREE.NearestMipmapLinearFilter,
		9987: THREE.LinearMipmapLinearFilter
	};

	var WEBGL_WRAPPINGS = {
		33071: THREE.ClampToEdgeWrapping,
		33648: THREE.MirroredRepeatWrapping,
		10497: THREE.RepeatWrapping
	};

	var WEBGL_TYPE_SIZES = {
		'SCALAR': 1,
		'VEC2': 2,
		'VEC3': 3,
		'VEC4': 4,
		'MAT2': 4,
		'MAT3': 9,
		'MAT4': 16
	};

	var ATTRIBUTES = {
		POSITION: 'position',
		NORMAL: 'normal',
		TANGENT: 'tangent',
		TEXCOORD_0: 'uv',
		TEXCOORD_1: 'uv2',
		COLOR_0: 'color',
		WEIGHTS_0: 'skinWeight',
		JOINTS_0: 'skinIndex',
	};

	var PATH_PROPERTIES = {
		scale: 'scale',
		translation: 'position',
		rotation: 'quaternion',
		weights: 'morphTargetInfluences'
	};

	var INTERPOLATION = {
		CUBICSPLINE: undefined, // We use a custom interpolant (GLTFCubicSplineInterpolation) for CUBICSPLINE purposes
		LINEAR: THREE.InterpolateLinear,
		STEP: THREE.InterpolateDiscrete
	};

	var ALPHA_MODES = {
		OPAQUE: 'OPAQUE',
		MASK: 'MASK',
		BLEND: 'BLEND'
	};

	/* UTILITY FUNCTIONS */

	function resolveURL( url, path ) {

		// Invalid URL
		if ( typeof url !== 'string' || url === '' ) return '';

		// Host Relative URL
		if ( /^https?:\/\//i.test( path ) && /^\//.test( url ) ) {

			path = path.replace( /(^https?:\/\/[^\/]+).*/i, '$1' );

		}

		// Absolute URL http://, https://, //
		if ( /^(https?:\/\/|^\/\/)/i.test( url ) ) return url;

		// Data URI
		if ( /^data:.*,.*$/i.test( url ) ) return url;

		// Blob URL
		if ( /^blob:.*$/i.test( url ) ) return url;

		// Relative URL
		return path + url;

	}

	/**
	 * Specification: https://github.com/KhronosGroup/glTF/blob/master/specification/2.0/README.md#default-material
	 */
	function createDefaultMaterial( cache ) {

		if ( cache[ 'DefaultMaterial' ] === undefined ) {

			cache[ 'DefaultMaterial' ] = new THREE.MeshStandardMaterial( {
				color: 0xFFFFFF,
				emissive: 0x000000,
				metalness: 1,
				roughness: 1,
				transparent: false,
				depthTest: true,
				side: THREE.FrontSide
			} );

		}

		return cache[ 'DefaultMaterial' ];

	}

	function addUnknownExtensionsToUserData( knownExtensions, object, objectDef ) {

		// Add unknown glTF extensions to an object's userData.
		for ( var name in objectDef.extensions ) {

			if ( knownExtensions[ name ] === undefined ) {

				object.userData.gltfExtensions = object.userData.gltfExtensions || {};
				object.userData.gltfExtensions[ name ] = objectDef.extensions[ name ];

			}

		}

	}

	/**
	 * @param {THREE.Object3D|THREE.Material|THREE.BufferGeometry} object
	 * @param {GLTF.definition} gltfDef
	 */
	function assignExtrasToUserData( object, gltfDef ) {

		if ( gltfDef.extras !== undefined ) {

			if ( typeof gltfDef.extras === 'object' ) {

				Object.assign( object.userData, gltfDef.extras );

			} else {

				console.warn( 'THREE.GLTFLoader: Ignoring primitive type .extras, ' + gltfDef.extras );

			}

		}

	}

	/**
	 * Specification: https://github.com/KhronosGroup/glTF/blob/master/specification/2.0/README.md#morph-targets
	 *
	 * @param {THREE.BufferGeometry} geometry
	 * @param {Array<GLTF.Target>} targets
	 * @param {GLTFParser} parser
	 * @return {Promise<THREE.BufferGeometry>}
	 */
	function addMorphTargets( geometry, targets, parser ) {

		var hasMorphPosition = false;
		var hasMorphNormal = false;
		var hasMorphTangent = false;

		for ( var i = 0, il = targets.length; i < il; i ++ ) {

			var target = targets[ i ];

			if ( target.POSITION !== undefined ) hasMorphPosition = true;
			if ( target.NORMAL !== undefined ) hasMorphNormal = true;
			if ( target.TANGENT !== undefined ) hasMorphTangent = true;

			if ( hasMorphPosition && hasMorphNormal && hasMorphTangent ) break;

		}

		if ( ! hasMorphPosition && ! hasMorphNormal && ! hasMorphTangent ) return Promise.resolve( geometry );

		var pendingPositionAccessors = [];
		var pendingNormalAccessors = [];
		var pendingTangentAccessors = [];

		for ( var i = 0, il = targets.length; i < il; i ++ ) {

			var target = targets[ i ];

			if ( hasMorphPosition ) {

				pendingPositionAccessors.push(
					target.POSITION !== undefined
						? parser.getDependency( 'accessor', target.POSITION )
						: geometry.attributes.position
				);

			}

			if ( hasMorphNormal ) {

				pendingNormalAccessors.push(
					target.NORMAL !== undefined
						? parser.getDependency( 'accessor', target.NORMAL )
						: geometry.attributes.normal
				);

			}

			if ( hasMorphTangent ) {

				pendingTangentAccessors.push(
					target.TANGENT !== undefined
						? parser.getDependency( 'accessor', target.TANGENT )
						: geometry.attributes.tangent
				);

			}

		}

		return Promise.all( [
			Promise.all( pendingPositionAccessors ),
			Promise.all( pendingNormalAccessors ),
			Promise.all( pendingTangentAccessors )
		] ).then( function ( accessors ) {

			var morphPositions = accessors[ 0 ];
			var morphNormals = accessors[ 1 ];
			var morphTangents = accessors[ 2 ];

			if ( hasMorphPosition ) geometry.morphAttributes.position = morphPositions;
			if ( hasMorphNormal ) geometry.morphAttributes.normal = morphNormals;
			if ( hasMorphTangent ) geometry.morphAttributes.tangent = morphTangents;
			geometry.morphTargetsRelative = true;

			return geometry;

		} );

	}

	/**
	 * @param {THREE.Mesh} mesh
	 * @param {GLTF.Mesh} meshDef
	 */
	function updateMorphTargets( mesh, meshDef ) {

		mesh.updateMorphTargets();

		if ( meshDef.weights !== undefined ) {

			for ( var i = 0, il = meshDef.weights.length; i < il; i ++ ) {

				mesh.morphTargetInfluences[ i ] = meshDef.weights[ i ];

			}

		}

		// .extras has user-defined data, so check that .extras.targetNames is an array.
		if ( meshDef.extras && Array.isArray( meshDef.extras.targetNames ) ) {

			var targetNames = meshDef.extras.targetNames;

			if ( mesh.morphTargetInfluences.length === targetNames.length ) {

				mesh.morphTargetDictionary = {};

				for ( var i = 0, il = targetNames.length; i < il; i ++ ) {

					mesh.morphTargetDictionary[ targetNames[ i ] ] = i;

				}

			} else {

				console.warn( 'THREE.GLTFLoader: Invalid extras.targetNames length. Ignoring names.' );

			}

		}

	}

	function isPrimitiveEqual( a, b ) {

		if ( a.indices !== b.indices ) {

			return false;

		}

		var attribA = a.attributes || {};
		var attribB = b.attributes || {};
		var keysA = Object.keys( attribA );
		var keysB = Object.keys( attribB );

		if ( keysA.length !== keysB.length ) {

			return false;

		}

		for ( var i = 0, il = keysA.length; i < il; i ++ ) {

			var key = keysA[ i ];

			if ( attribA[ key ] !== attribB[ key ] ) {

				return false;

			}

		}

		return true;

	}

	function getCachedMesh(
		cache,
		node,
		mesh,
		primitive,
		materials
	) {

		// Acquired from slack
		// https://threejs.slack.com/archives/C02F2U15F/p1615923298000700

		for ( const M of materials ) {

			if ( 2 * M.length > cache.length ) return;

			for ( let i = 0; i < cache.length; i += 2 * M.length ) {

				let found = true;
				for ( let j = 0; j < M.length; j++ ) {

					if ( cache[ i + j ] !== M[ j ] ) {

						found = false;
						break;

					}

				}

				if ( found ) {

					for ( let j = 0; j < M.length; j++ ) {

						const a = node.meshes[ mesh ].primitives[ primitive ];
						const b = cache[ i + M.length + j ];

						if ( ! isPrimitiveEqual( a, b ) ) {

							found = false;
							break;

						}

					}

				}

				if ( found ) {

					return cache[ i + 2 * M.length ];

				}

			}

		}

	}

	function getCachedCombinedMesh( cache, node, mesh, materials ) {

		for ( const M of materials ) {

			if ( 2 * M.length > cache.length ) return;

			for ( let i = 0; i < cache.length; i += 2 * M.length ) {

				let found = true;
				for ( let j = 0; j < M.length; j++ ) {

					if ( cache[ i + j ] !== M[ j ] ) {

						found = false;
						break;

					}

				}

				if ( found ) {

					for ( let j = 0; j < M.length; j++ ) {

						if ( cache[ i + M.length + j ] !== node.meshes[ mesh ].primitives[ j ] ) {

							found = false;
							break;

						}

					}

				}

				if ( found ) {

					return cache[ i + 2 * M.length ];

				}

			}

		}

	}

	function getCachedScene( cache, scene ) {

		for ( let i = 0; i < cache.length; i += 2 ) {

			if ( cache[ i ] === scene ) {

				return cache[ i + 1 ];

			}

		}

	}

	/* PARSER */

	function GLTFParser( json, options ) {

		this.json = json || {};
		this.extensions = {};
		this.plugins = {};
		this.options = options || {};

		// loader object cache
		this.cache = new GLTFRegistry();

		// associations between Three.js objects and glTF elements
		this.associations = new Map();

		// THREE.BufferGeometry filePromises
		this.filePromises = [];

		// THREE.Texture filePromises
		this.texturePromises = [];

		this.nodeNames = new Map();
		this.meshNames = new Map();

		this.fileLoader = new THREE.FileLoader( this.options.manager );

		this.textureLoader = new THREE.TextureLoader( this.options.manager );
		this.textureLoader.setCrossOrigin( this.options.crossOrigin );
		this.textureLoader.setRequestHeader( this.options.requestHeader );

	}

	GLTFParser.prototype.setExtensions = function ( extensions ) {

		this.extensions = extensions;

	};

	GLTFParser.prototype.setPlugins = function ( plugins ) {

		this.plugins = plugins;

	};

	GLTFParser.prototype.parse = function ( onLoad, onError ) {

		var parser = this;
		var json = this.json;

		// Clear the loader cache
		this.cache.removeAll();

		// Mark the special nodes/meshes in json for efficient parse
		this._markDefs();

		Promise.all( this._build() ).then( function ( objects ) {

			var scene = objects[ json.scene || 0 ];

			if ( scene.isRef ) scene = scene.object;

			var scenes = [];
			for ( const o of objects ) {

				if ( o.isRef && o.isScene ) {

					scenes.push( o.object );

				}

			}

			var cameras = [];
			for ( const o of objects ) {

				if ( o.isRef && o.isCamera ) {

					cameras.push( o.object );

				}

			}

			var animations = [];
			for ( const o of objects ) {

				if ( o.isRef && o.isAnimation ) {

					animations.push( o.object );

				}

			}

			// This is a weird workaround for the reasons described in #23470
			const cache = [];
			let i = 0;
			for ( const o of objects ) {

				if ( o.isRef ) {

					if ( o.isMesh ) {

						const materials = [];
						const primitives = [];
						for ( const m of o.object.children ) {

							materials.push( m.material );
							const p = json.meshes[ o.mesh ].primitives[ o.object.children.indexOf( m ) ];
							primitives.push( p );

						}

						cache[ i++ ] = materials;
						cache[ i++ ] = primitives;
						cache[ i++ ] = o.object;

					} else if ( o.isScene ) {

						cache[ i++ ] = json.scenes[ o.scene ];
						cache[ i++ ] = o.object;

					}

				}

			}

			onLoad( {
				scene: scene,
				scenes: scenes,
				cameras: cameras,
				animations: animations,
				asset: json.asset,
				parser: parser,
				userData: {},
				// This is a weird workaround for the reasons described in #23470
				_cache: cache
			} );

		} ).catch( onError );

	};

	GLTFParser.prototype._markDefs = function () {

		var json = this.json;

		if ( json.nodes ) {

			for ( let i = 0, il = json.nodes.length; i < il; i++ ) {

				const node = json.nodes[ i ];

				if ( node.mesh !== undefined ) {

					if ( ! json.meshes[ node.mesh ]._buffer ) {

						json.meshes[ node.mesh ]._buffer = { isObject3D: true };

					}

				}

				if ( node.camera !== undefined ) {

					if ( ! json.cameras[ node.camera ]._buffer ) {

						json.cameras[ node.camera ]._buffer = { isObject3D: true };

					}

				}

				if (
					node.extensions &&
					node.extensions[ EXTENSIONS.KHR_LIGHTS_PUNCTUAL ] &&
					node.extensions[ EXTENSIONS.KHR_LIGHTS_PUNCTUAL ].light !== undefined
				) {

					const lights = json.extensions[ EXTENSIONS.KHR_LIGHTS_PUNCTUAL ].lights;
					const light = lights[ node.extensions[ EXTENSIONS.KHR_LIGHTS_PUNCTUAL ].light ];

					if ( ! light._buffer ) {

						light._buffer = { isObject3D: true };

					}

				}

			}

		}

	};

	GLTFParser.prototype._build = function () {

		var json = this.json;
		const build = [];

		if ( json.scenes ) {

			for ( const scene of json.scenes ) {

				build.push( this.getDependency( 'scene', json.scenes.indexOf( scene ) ) );

			}

		}

		if ( json.animations ) {

			for ( const animation of json.animations ) {

				build.push( this.getDependency( 'animation', json.animations.indexOf( animation ) ) );

			}

		}

		// According to the spec, assets without scenes or nodes are valid
		// but `gltf-validator` has many issues with them.
		// As a compromise, we parse all nodes and scenes.
		for ( const name in json ) {

			if ( name !== 'asset' && name !== 'extras' && name !== 'extensions' && name !== 'parser' ) {

				const defs = json[ name ];
				if ( Array.isArray( defs ) ) {

					for ( const def of defs ) {

						if ( def._buffer && ! def._activeRef ) {

							const pending = this.getDependency( name.slice( 0, - 1 ), defs.indexOf( def ) );
							build.push( pending );

						}

					}

				}

			}

		}

		return build;

	};

	/**
	 * @param {string} type
	 * @param {number} index
	 * @return {Promise<THREE.Object3D|THREE.Material|THREE.Texture|THREE.AnimationClip|ArrayBuffer|string>}
	 */
	GLTFParser.prototype.getDependency = function ( type, index ) {

		var cacheKey = type + ':' + index;
		var dependency = this.cache.get( cacheKey );

		if ( ! dependency ) {

			this.json[ type + 's' ][ index ]._activeRef = true;
			switch ( type ) {

				case 'scene':
					dependency = this.loadScene( index );
					break;

				case 'node':
					dependency = this.loadNode( index );
					break;

				case 'mesh':
					dependency = this._loadMesh( index );
					break;

				case 'accessor':
					dependency = this.loadAccessor( index );
					break;

				case 'bufferView':
					dependency = this.loadBufferView( index );
					break;

				case 'buffer':
					dependency = this.loadBuffer( index );
					break;

				case 'material':
					dependency = this._loadMaterial( index );
					break;

				case 'texture':
					dependency = this.loadTexture( index );
					break;

				case 'skin':
					dependency = this.loadSkin( index );
					break;

				case 'animation':
					dependency = this.loadAnimation( index );
					break;

				case 'camera':
					dependency = this.loadCamera( index );
					break;

				default:
					dependency = this._getDependency( type, index );
					break;

			}

			this.cache.add( cacheKey, dependency );

		}

		return dependency;

	};

	GLTFParser.prototype._getDependency = function ( type, index ) {

		const defs = this.json[ `${type}s` ];
		if ( ! defs ) {

			throw new Error( `Invalid type: ${type}` );

		}

		const def = defs[ index ];
		const cacheKey = type + ':' + index;

		let dependency = this.cache.get( cacheKey );

		if ( ! dependency ) {

			const fn = `load${type.charAt( 0 ).toUpperCase() + type.slice( 1 )}`;
			if ( ! this[ fn ] ) {

				throw new Error( `Invalid type: ${type}` );

			}

			dependency = this[ fn ]( index );

			this.cache.add( cacheKey, dependency );

		}

		return dependency;

	};

	/**
	 * @param {string} type
	 * @param {number} index
	 * @return {Promise<THREE.Object3D|THREE.Material|THREE.Texture|THREE.AnimationClip|ArrayBuffer|string>}
	 */
	GLTFParser.prototype.getDependencies = function ( type, indices ) {

		var self = this;
		return Promise.all( indices.map( function ( index ) {

			return self.getDependency( type, index );

		} ) );

	};

	/**
	 * Specification: https://github.com/KhronosGroup/glTF/blob/master/specification/2.0/README.md#buffers-and-buffer-views
	 * @param {number} bufferIndex
	 * @return {Promise<ArrayBuffer>}
	 */
	GLTFParser.prototype.loadBuffer = function ( bufferIndex ) {

		var bufferDef = this.json.buffers[ bufferIndex ];
		var loader = this.fileLoader;

		if ( bufferDef.uri ) {

			var url = resolveURL( bufferDef.uri, this.options.path );

			return new Promise( function ( resolve, reject ) {

				loader.load( url, resolve, undefined, function () {

					reject( new Error( 'THREE.GLTFLoader: Failed to load buffer "' + bufferDef.uri + '".' ) );

				} );

			} );

		}

		var extensions = this.extensions;
		var KHR_binary_glTF = extensions[ EXTENSIONS.KHR_BINARY_GLTF ];

		if ( KHR_binary_glTF ) {

			var data = KHR_binary_glTF.body;
			if ( data ) return Promise.resolve( data );

		}

		return Promise.reject( new Error( 'THREE.GLTFLoader: Unable to load buffer ' + bufferIndex ) );

	};

	/**
	 * Specification: https://github.com/KhronosGroup/glTF/blob/master/specification/2.0/README.md#buffers-and-buffer-views
	 * @param {number} bufferViewIndex
	 * @return {Promise<ArrayBuffer>}
	 */
	GLTFParser.prototype.loadBufferView = function ( bufferViewIndex ) {

		var bufferViewDef = this.json.bufferViews[ bufferViewIndex ];

		for ( var pluginName in this.plugins ) {

			var plugin = this.plugins[ pluginName ];

			if ( plugin.loadBufferView ) {

				var bufferViewPromise = plugin.loadBufferView( bufferViewIndex );

				if ( bufferViewPromise ) {

					return bufferViewPromise;

				}

			}

		}

		return this.getDependency( 'buffer', bufferViewDef.buffer ).then( function ( buffer ) {

			var byteLength = bufferViewDef.byteLength || 0;
			var byteOffset = bufferViewDef.byteOffset || 0;
			return buffer.slice( byteOffset, byteOffset + byteLength );

		} );

	};

	/**
	 * Specification: https://github.com/KhronosGroup/glTF/blob/master/specification/2.0/README.md#accessors
	 * @param {number} accessorIndex
	 * @return {Promise<THREE.BufferAttribute|THREE.InterleavedBufferAttribute>}
	 */
	GLTFParser.prototype.loadAccessor = function ( accessorIndex ) {

		var parser = this;
		var json = this.json;

		var accessorDef = this.json.accessors[ accessorIndex ];

		if ( accessorDef.bufferView === undefined && accessorDef.sparse === undefined ) {

			var itemSize = WEBGL_TYPE_SIZES[ accessorDef.type ];
			var TypedArray = WEBGL_COMPONENT_TYPES[ accessorDef.componentType ];
			var data = new TypedArray( accessorDef.count * itemSize );
			return Promise.resolve( new THREE.BufferAttribute( data, itemSize ) );

		}

		var pendingBufferViews = [];

		if ( accessorDef.bufferView !== undefined ) {

			pendingBufferViews.push( this.getDependency( 'bufferView', accessorDef.bufferView ) );

		} else {

			pendingBufferViews.push( null );

		}

		if ( accessorDef.sparse !== undefined ) {

			pendingBufferViews.push( this.getDependency( 'bufferView', accessorDef.sparse.indices.bufferView ) );
			pendingBufferViews.push( this.getDependency( 'bufferView', accessorDef.sparse.values.bufferView ) );

		}

		return Promise.all( pendingBufferViews ).then( function ( bufferViews ) {

			var bufferView = bufferViews[ 0 ];

			var itemSize = WEBGL_TYPE_SIZES[ accessorDef.type ];
			var TypedArray = WEBGL_COMPONENT_TYPES[ accessorDef.componentType ];

			var elementBytes = TypedArray.BYTES_PER_ELEMENT;

			var byteOffset = accessorDef.byteOffset || 0;
			var byteStride = accessorDef.bufferView !== undefined ? json.bufferViews[ accessorDef.bufferView ].byteStride : undefined;

			var normalized = accessorDef.normalized === true;
			var array;

			if ( byteStride && byteStride !== itemSize * elementBytes ) {

				// Each element is not tightly packed.
				// Create a new buffer and copy data from
				// the source buffer with appropriate stride.

				var interleavedBuffer = new THREE.InterleavedBuffer(
					new TypedArray( bufferView, byteOffset, accessorDef.count * byteStride / elementBytes ),
					byteStride / elementBytes
				);

				array = new THREE.InterleavedBufferAttribute(
					interleavedBuffer,
					itemSize,
					0,
					normalized
				);

			} else {

				if ( bufferView === null ) {

					array = new TypedArray( accessorDef.count * itemSize );

				} else {

					array = new TypedArray( bufferView, byteOffset, accessorDef.count * itemSize );

				}

				array = new THREE.BufferAttribute( array, itemSize, normalized );

			}

			// https://github.com/KhronosGroup/glTF/blob/master/specification/2.0/README.md#sparse-accessors
			if ( accessorDef.sparse !== undefined ) {

				var itemSizeIndices = WEBGL_TYPE_SIZES.SCALAR;
				var TypedArrayIndices = WEBGL_COMPONENT_TYPES[ accessorDef.sparse.indices.componentType ];

				var byteOffsetIndices = accessorDef.sparse.indices.byteOffset || 0;
				var byteOffsetValues = accessorDef.sparse.values.byteOffset || 0;

				var sparseIndices = new TypedArrayIndices( bufferViews[ 1 ], byteOffsetIndices, accessorDef.sparse.count * itemSizeIndices );
				var sparseValues = new TypedArray( bufferViews[ 2 ], byteOffsetValues, accessorDef.sparse.count * itemSize );

				if ( bufferView !== null ) {

					// Avoid modifying the original ArrayBuffer, if the bufferView wasn't sparse only.
					array.array = array.array.slice();

				}

				for ( var i = 0, il = sparseIndices.length; i < il; i ++ ) {

					var index = sparseIndices[ i ];

					array.setX( index, sparseValues[ i * itemSize ] );
					if ( itemSize >= 2 ) array.setY( index, sparseValues[ i * itemSize + 1 ] );
					if ( itemSize >= 3 ) array.setZ( index, sparseValues[ i * itemSize + 2 ] );
					if ( itemSize >= 4 ) array.setW( index, sparseValues[ i * itemSize + 3 ] );
					if ( itemSize >= 5 ) throw new Error( 'THREE.GLTFLoader: Unsupported itemSize in sparse BufferAttribute.' );

				}

			}

			return array;

		} );

	};

	/**
	 * Specification: https://github.com/KhronosGroup/glTF/tree/master/specification/2.0/README.md#textures
	 * @param {number} textureIndex
	 * @return {Promise<THREE.Texture>}
	 */
	GLTFParser.prototype.loadTexture = function ( textureIndex ) {

		for ( var pluginName in this.plugins ) {

			var plugin = this.plugins[ pluginName ];

			if ( plugin.loadTexture ) {

				var texturePromise = plugin.loadTexture( textureIndex );

				if ( texturePromise ) {

					return texturePromise;

				}

			}

		}

		var json = this.json;
		var options = this.options;
		var textureLoader = this.textureLoader;

		var textureDef = json.textures[ textureIndex ];

		var sourceIndex = textureDef.source;
		var sourceDef = json.images[ sourceIndex ];
		var sourcePromise;

		if ( sourceDef.bufferView !== undefined ) {

			// Load binary image data from bufferView, if provided.

			sourcePromise = this.getDependency( 'bufferView', sourceDef.bufferView ).then( function ( bufferView ) {

				var blob = new Blob( [ bufferView ], { type: sourceDef.mimeType } );
				var url = URL.createObjectURL( blob );

				return new Promise( function ( resolve, reject ) {

					textureLoader.load( url, resolve, undefined, reject );

				} );

			} );

		} else if ( sourceDef.uri ) {

			var handler = options.manager.getHandler( sourceDef.uri );

			if ( handler !== null ) {

				sourcePromise = new Promise( function ( resolve, reject ) {

					handler.load( resolveURL( sourceDef.uri, options.path ), resolve, undefined, reject );

				} );

			}

		}

		return sourcePromise;

	};

	GLTFParser.prototype.loadScene = function ( sceneIndex ) {

		var json = this.json;
		var sceneDef = json.scenes[ sceneIndex ];

		var scene = new THREE.Scene();
		this.associations.set( scene, sceneDef );

		if ( sceneDef.nodes ) {

			var nodePromises = sceneDef.nodes.map( function ( nodeIndex ) {

				return this.getDependency( 'node', nodeIndex );

			}.bind( this ) );

			return Promise.all( nodePromises ).then( function ( nodes ) {

				nodes.forEach( function ( node ) {

					scene.add( node );

				} );

				return scene;

			} );

		} else {

			return scene;

		}

	};

	GLTFParser.prototype.loadNode = function ( nodeIndex ) {

		var json = this.json;
		var nodeDef = json.nodes[ nodeIndex ];

		var node = new THREE.Object3D();
		this.associations.set( node, nodeDef );

		if ( nodeDef.mesh !== undefined ) {

			var meshPromise = this.getDependency( 'mesh', nodeDef.mesh );

			return meshPromise.then( function ( mesh ) {

				node.add( mesh );

				return node;

			} );

		} else {

			return node;

		}

	};

	GLTFParser.prototype._loadMesh = function ( meshIndex ) {

		var json = this.json;
		var meshDef = json.meshes[ meshIndex ];

		var geometry = new THREE.BufferGeometry();
		this.associations.set( geometry, meshDef );

		if ( meshDef.primitives ) {

			var primitivePromises = meshDef.primitives.map( function ( primitiveDef ) {

				return this.getDependency( 'primitive', primitiveDef );

			}.bind( this ) );

			return Promise.all( primitivePromises ).then( function ( primitives ) {

				primitives.forEach( function ( primitive ) {

					geometry.addGroup( primitive.indices, primitive.material );

				} );

				return geometry;

			} );

		} else {

			return geometry;

		}

	};

	GLTFParser.prototype._loadMaterial = function ( materialIndex ) {

		var json = this.json;
		var materialDef = json.materials[ materialIndex ];

		var material = new THREE.MeshStandardMaterial();
		this.associations.set( material, materialDef );

		return Promise.all( this.pluginCallbacks.map( function ( callback ) {

			return callback( new GLTFParser( json, this.options ) ).extendParams( material, materialDef, this );

		}.bind( this ) ) ).then( function () {

			return material;

		} );

	};

	GLTFParser.prototype.loadSkin = function ( skinIndex ) {

		var json = this.json;
		var skinDef = json.skins[ skinIndex ];

		var skeleton = this.getDependency( 'node', skinDef.skeleton );
		var joints = this.getDependencies( 'node', skinDef.joints );

		return Promise.all( [ skeleton, joints ] ).then( function ( res ) {

			var skeleton = res[ 0 ];
			var joints = res[ 1 ];

			var skin = new THREE.SkinnedMesh( res[ 2 ], res[ 3 ] );
			skin.bind( skeleton, joints );

			return skin;

		} );

	};

	GLTFParser.prototype.loadAnimation = function ( animationIndex ) {

		var json = this.json;
		var animationDef = json.animations[ animationIndex ];

		var clip = new THREE.AnimationClip( animationDef.name, animationDef.duration, animationDef.tracks );
		this.associations.set( clip, animationDef );

		return clip;

	};

	GLTFParser.prototype.loadCamera = function ( cameraIndex ) {

		var json = this.json;
		var cameraDef = json.cameras[ cameraIndex ];

		var camera = new THREE.PerspectiveCamera( cameraDef.perspective.fov, cameraDef.perspective.aspect, cameraDef.perspective.near, cameraDef.perspective.far );
		this.associations.set( camera, cameraDef );

		return camera;

	};

} )(); 