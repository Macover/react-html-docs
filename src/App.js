import logo from './logo.svg';
import './App.css';

import htmlDocx from 'html-docx-js/dist/html-docx';
import { saveAs } from "file-saver";
import htmlParser from 'html-react-parser'
import { renderToString } from 'react-dom/server'
import { useState } from 'react';

function App() {

  const [fileName, setFileName] = useState('Upload a HTML file.');
  const [htmlObject, setHtmlObject] = useState();

  let fileReader;

  const handleReader = async (e) => {
    const file = e.target.files[0]
    setFileName(file.name)
    fileReader = new FileReader();
    fileReader.onloadend = (e) => {
      setHtmlObject(htmlParser(fileReader.result))
    }
    fileReader.readAsText(file)
  }

  const convertHtmlToDocx = () => {

    const bodyContent = renderToString(
      htmlObject.props.children.find(children => children.type === 'body')
    );

    const content = `
          <html lang="en">
          <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
            ${bodyContent}
          </html>`;
    
    var data = htmlDocx.asBlob(content);
    const newFileName = fileName.split('.html')[0];
    saveAs(data, `${newFileName}.docx`);
  }


  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <div className='App-content'>
          <p>
            HTML to <code>DOCX</code>
          </p>
          <div className='content-input'>
            <input
              type='text'
              placeholder={fileName}
              disabled />
            <input
              accept='.html'
              onChange={(e) => handleReader(e)}
              type='file' />
          </div>
          <button
            onClick={convertHtmlToDocx}
          >Download .docx file</button>
        </div>
      </header>
    </div>
  );
}

export default App;
