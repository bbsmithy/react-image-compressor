import React, { Component } from 'react';
import './App.css';
import fbICU from './compressor';
import Paper from 'material-ui/Paper';
import Snackbar from 'material-ui/Snackbar';
import Grid from 'react-bootstrap/lib/Grid';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';

const FirebaseICU = new fbICU();

const ImageRow = props => {
  return (
    <Paper class="imageRow">
      <Row style={{ padding: 15 }}>
        <Col md={6}>
          <img style={{ width: '100%' }} src={props.image} />
        </Col>
        <Col md={6}>
          <p>Size: {props.imageSize}</p>
        </Col>
      </Row>
    </Paper>
  );
};

const ImageList = props => {
  const { images } = props;
  const listImages = images.map(image => {
    return <ImageRow image={image.dataUrl} imageSize={image.imgFileSizeFormatted} />;
  });
  return <div>{listImages}</div>;
};

const CompressedImageList = props => {
  const { images } = props;

  const listImages = images.map(image => {
    const { imageDataUrl } = image;
    let imageSize = FirebaseICU.getImageSize(imageDataUrl);
    return <ImageRow image={imageDataUrl} imageSize={imageSize.imgFileSizeFormatted} />;
  });
  return <div>{listImages}</div>;
};

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      imagesToRender: [],
      compressedImagesToRender: []
    };
  }

  //Put files into array
  //Loop through array
  //First read each with filereader output images using file.src 1/4 image size
  //When u press submit loop through file array compress (J-I-C) a

  _handleUploadFolderChange = (event, index, value) => {
    this.setState({
      uploadFolder: value
    });
  };

  _handleCompressImages = () => {
    let newCompressedImages = this.state.compressedImagesToRender;
    this.setState({ compressing: true });
    this.state.imagesToRender.forEach(image => {
      const { dataUrl, fileID, imgFileSize } = image;
      var imageToCompress = new Image();
      imageToCompress.src = dataUrl;
      const imageDataUrl = FirebaseICU.compress(imageToCompress, 500, Math.round(imgFileSize / 1024));
      const newImageData = { imageDataUrl, fileID };
      newCompressedImages.unshift(newImageData);
    });
    this.setState({
      compressedImagesToRender: newCompressedImages,
      compressing: false,
      imagesToRender: []
    });
  };

  fileToDataUrl = file => {
    const fileID = file.name;
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = event => {
        let { imgFileSize, imgFileSizeFormatted } = FirebaseICU.getImageSize(event.target.result);
        resolve({
          imgFileSize,
          imgFileSizeFormatted,
          dataUrl: event.target.result,
          fileID
        });
      };
      reader.readAsDataURL(file);
    });
  };

  renderUploadButton = () => {
    const { compressedImagesToRender, uploadFolder } = this.state;
    if (compressedImagesToRender.length > 0 && uploadFolder) {
      return (
        <Col style={{ padding: 0 }} md={4}>
          <label onClick={this._handleUpload} class="button">
            Upload Images
          </label>
        </Col>
      );
    } else {
      return (
        <Col md={4}>
          <label class="disabledButton" style={{ color: '#efefef' }}>
            Upload Images
          </label>
        </Col>
      );
    }
  };

  fileReaderArray = async arr => {
    let newImagesToRender = this.state.imagesToRender;
    for (let i = 0; i < arr.length; i++) {
      await this.fileToDataUrl(arr[i]).then(imageData => {
        newImagesToRender.unshift(imageData);
      });
    }
    return newImagesToRender;
  };

  _handleImageChange = async event => {
    this.setState({ inputting: true });
    let arr = event.target.files;
    this.fileReaderArray(arr).then(dataUrlArr => {
      this.setState({
        imagesToRender: dataUrlArr,
        inputting: false
      });
    });
  };

  render() {
    return (
      <Grid>
        <Paper
          style={{
            padding: 20,
            backgroundColor: '#003D7D',
            color: 'white',
            width: '100%'
          }}
        >
          <h1>Image Compressor</h1>
        </Paper>

        <Row style={{ marginTop: 20 }}>
          <Col md={6}>
            <input
              type="file"
              name="file"
              id="file"
              style={{ display: 'none' }}
              multiple
              accept="image/"
              onChange={e => {
                this._handleImageChange(e);
              }}
              class="inputfile"
            />
            <label class="button" for="file">
              {!this.state.inputting && 'Choose a image'}
              {this.state.inputting && 'Loading Images'}
            </label>
            {this.state.imagesToRender.length > 0 && (
              <label onClick={this._handleCompressImages} class="button">
                {this.state.compressing && 'Compressing Images...'}
                {!this.state.compressing && 'Compress Images'}
              </label>
            )}
          </Col>
          <Col md={6}>
            <Row>
              <h4>Compressed Results</h4>
            </Row>
          </Col>
        </Row>
        <Row>
          <Col xs={6} md={6}>
            <ImageList images={this.state.imagesToRender} />
          </Col>
          <Col xs={6} md={6}>
            <CompressedImageList images={this.state.compressedImagesToRender} />
          </Col>
        </Row>
        <Snackbar
          open={this.state.uploadSuccess}
          message="Upload(s) Sucessful"
          autoHideDuration={4000}
          onRequestClose={() => {
            this.setState({
              uploadSuccess: false
            });
          }}
        />
      </Grid>
    );
  }
}

export default App;
