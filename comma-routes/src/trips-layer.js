import {Layer, assembleShaders} from 'deck.gl';
import {Model, Program, Geometry, glGetDebugInfo} from 'luma.gl';
import {join} from 'path';

const glslify = require('glslify');

class TripsLayer extends Layer {
    initializeState() {
        const {gl} = this.context;
        const {attributeManager} = this.state;

        const model = this.getModel(gl);
        attributeManager.addDynamic({
              indices: {size: 1, update: this.calculateIndices, isIndexed: true},
              positions: {size: 3, update: this.calculatePositions},
              colors: {size: 3, update: this.calculateColors}
        });

        gl.getExtension('OES_element_index_uint');
        this.setState({model});
        gl.lineWidth(this.props.strokeWidth);
        this.countVertices();
        this.updateUniforms();
    }

    updateState({props, oldProps, changeFlags: {dataChanged, somethingChanged}}) {
        /*
        Called when a new layer has been matched with a layer from the previous render cycle (resulting in new props being passed to that layer), or when context has changed and layers are about to be drawn.
        */

        const {attributeManager} = this.state;
        if (dataChanged) {
          this.countVertices(props.data);
        }
        if (somethingChanged) {
          this.updateUniforms();
        }
    }

    countVertices(data) {
        if (!data) {
          return;
        }
        console.log(data)
        const {getPath} = this.props;
        let vertexCount = 0;
        const pathLengths = data.reduce((acc, d) => {
          const l = getPath(d).length;
          vertexCount += l;
          return [...acc, l];
        }, []);
        this.setState({pathLengths, vertexCount});
      }

      updateUniforms() {
        const {opacity, trailLength, currentTime} = this.props;
        this.setUniforms({
          opacity,
          trailLength,
          currentTime
        });
      }

      getShaderSync(shaderFile) {
        const shaderPath = join(__dirname, 'gl', shaderFile)
        const xhr = new XMLHttpRequest()
        xhr.open("GET", shaderPath, false)
        xhr.send(null)
        if(xhr.status === 200) {
            return xhr.responseText
        }
      }

      getModel(gl) {
          const modelParams = {
            program: new Program(gl, assembleShaders(gl, {
              vs: this.getShaderSync('trips-layer-vertex.glsl'),
              fs: this.getShaderSync('trips-layer-fragment.glsl')
            })),
            geometry: new Geometry({
              id: this.props.id,
              drawMode: 'LINES'
            }),
            vertexCount: 0,
            isIndexed: true,
            onBeforeRender: () => {
              gl.enable(gl.BLEND);
              gl.enable(gl.POLYGON_OFFSET_FILL);
              gl.polygonOffset(2.0, 1.0);
              gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
              gl.blendEquation(gl.FUNC_ADD);
              console.log('beforerender')
            },
            onAfterRender: () => {
              gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
              gl.disable(gl.POLYGON_OFFSET_FILL);
              console.log('afterender')
            }
          }

          return new Model(modelParams);
        }
   calculateIndices(attribute) {
       const {pathLengths, vertexCount} = this.state;

       const indicesCount = (vertexCount - pathLengths.length) * 2;
       const indices = new Uint32Array(indicesCount);

       let offset = 0;
       let index = 0;
       for (let i = 0; i < pathLengths.length; i++) {
         const l = pathLengths[i];
         indices[index++] = offset;
         for (let j = 1; j < l - 1; j++) {
           indices[index++] = j + offset;
           indices[index++] = j + offset;
         }
         indices[index++] = offset + l - 1;
         offset += l;
       }
       attribute.value = indices;
       this.state.model.setVertexCount(indicesCount);
     }

     calculatePositions(attribute) {
       const {data, getPath} = this.props;
       const {vertexCount} = this.state;
       const positions = new Float32Array(vertexCount * 3);

       let index = 0;
       for (let i = 0; i < data.length; i++) {
         const path = getPath(data[i]);
         for (let j = 0; j < path.length; j++) {
           const pt = path[j];
           positions[index++] = pt[0];
           positions[index++] = pt[1];
           positions[index++] = pt[2];
         }
       }
       attribute.value = positions;
     }

     calculateColors(attribute) {
       const {data, getColor} = this.props;
       const {pathLengths, vertexCount} = this.state;
       const colors = new Float32Array(vertexCount * 3);

       let index = 0;
       for (let i = 0; i < data.length; i++) {
         const color = getColor(data[i]);
         const l = pathLengths[i];
         for (let j = 0; j < l; j++) {
           colors[index++] = color[0];
           colors[index++] = color[1];
           colors[index++] = color[2];
         }
       }
       attribute.value = colors;
     }
}

export default TripsLayer
