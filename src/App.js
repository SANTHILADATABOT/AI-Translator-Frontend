// import logo from './logo.svg';
import './App.css';
import { Button, Col, Flex, message, Row, Spin, } from 'antd';
import { useState } from 'react';
import Dragger from 'antd/es/upload/Dragger';
import { FileSearchOutlined, InboxOutlined } from '@ant-design/icons';

function App() {

  const [file, setFile] = useState(null);
  const [remessage, setMessage] = useState(null);
  const [oldmessage, setOldMessage] = useState(null);
  const [loading, setLaodnig] = useState(false);
  const handleFileChange = (info) => {
    const { fileList } = info;
    if (fileList.length === 0) {
      setFile(null);
      return;
    }
    const selectedFile = fileList[0];
    console.log('file', selectedFile)
    setFile(selectedFile);
  };
  console.log('file', file)
  const props = {
    name: 'file',
    multiple: false,
    showUploadList: false,
    beforeUpload: () => false,
    onChange: handleFileChange,
  };
  const boxStyle = {
    width: '100%',
    height: '100vh',
    borderRadius: 6,
    margin: '0px 10px'
  };
  const boxStyle2 = {
    // width: '100%',
    height: '100vh',
    borderRadius: 6,
    margin: '0px 10px'
  };
  const handleSubmit = async () => {
    setLaodnig(true);
    if (!file) {
      message.error('Please upload a valid Word file first.');
      return;
    }

    const formData = new FormData();
    if (!file) {
      alert('Please select a file');
      return;
    }
    formData.append('file', file.originFileObj);

    try {
      const response = await fetch('http://192.168.1.25:5555/api/hello', { // Make sure the endpoint matches
        method: 'POST',
        body: formData,
      });
      const result = await response.json();
      if (response.ok) {
        message.success('File uploaded successfully!');
        setOldMessage(result?.originalText);
        setMessage(result?.translatedText);
        setFile(null);
        setLaodnig(false);
      } else {
        message.error('File upload failed.');
      }
    } catch (error) {
      message.error('An error occurred while uploading the file.');
    }
  };
  const handleClose = () => {
    setFile(null)
    setMessage(null)
    setOldMessage(null)
  }

  const contentStyle = {
    padding: 50,
    background: 'rgba(0, 0, 0, 0.05)',
    borderRadius: 4,
  };
  const content = <div style={contentStyle} />;


  return (
    <div className="App">
      {loading ?
        <div style={{ width: '100%', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Spin tip="Translating" size="large">
            {content}
          </Spin>
        </div>
        :
        <>
          {!remessage && !oldmessage
            ?
            <Flex gap="middle" style={boxStyle} justify={'center'} vertical>
              <Row>
                <Col span={8}></Col>
                <Col span={8}>
                  <Flex gap="middle" vertical>
                    {!file ? <Dragger {...props}>
                      <p className="ant-upload-drag-icon">
                        <InboxOutlined />
                      </p>
                      <p className="ant-upload-text">Click or drag file to this area to upload</p>
                      <p className="ant-upload-hint">
                        Support for a single or bulk upload. Strictly prohibited from uploading company data or other
                        banned files.
                      </p>
                    </Dragger> :
                      <div style={{ marginTop: '20px' }}>
                        {/* File icon */}
                        <FileSearchOutlined style={{ fontSize: '24px', color: '#1890ff' }} />
                        <div style={{ marginLeft: '10px' }}>
                          <h3>{file.name}</h3>
                        </div>
                        {/* Close button (PNG image) */}

                        <Button style={{ width: '100%' }} type="primary" danger onClick={() => setFile(null)}>
                          Cancel
                        </Button>
                      </div>
                    }
                    <Button size={'large'} type="primary" onClick={handleSubmit}>Translate</Button>
                  </Flex>
                </Col>
                <Col span={8}></Col>
              </Row>
            </Flex>
            :
            <Flex gap="middle" style={boxStyle2} align='center' vertical >
              <Row>
                <Col span={2}></Col>
                <Col span={10} >
                  <h1>Old Text</h1>
                  <div style={{ margin: '5px', padding: '5px', border: '2px solid gray', borderRadius: '8px' }}>
                    <p>{oldmessage}</p>
                  </div>
                </Col>
                <Col span={10}>
                  <h1>Translated Text</h1>
                  <div style={{ margin: '5px', padding: '5px', border: '2px solid gray', borderRadius: '8px' }}>
                    <p>{remessage}</p>
                  </div>
                </Col>
                <Col span={2}>
                  <Button style={{ width: '100%' }} type="primary" danger onClick={handleClose}>
                    Close
                  </Button>
                </Col>
              </Row>
            </Flex>
          }
        </>
      }
    </div>
  );
}

export default App;
