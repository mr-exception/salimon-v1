import React from "react";
export default class JSONReader extends React.Component<IJSONReaderProps, {}> {
  private readFile = async (file: File): Promise<IUploadedJSON> =>
    new Promise((resolve, reject) => {
      const filename = file.name;
      function onReaderLoad(event: ProgressEvent<FileReader>) {
        if (!event.target) return;
        const result = event.target.result;
        if (typeof result !== "string") return;
        var obj = JSON.parse(result);
        resolve({ name: filename, value: obj });
      }
      var reader = new FileReader();
      reader.onload = onReaderLoad;
      reader.readAsText(file);
    });
  render() {
    return (
      <input
        accept=".json"
        type="file"
        multiple
        hidden
        ref={this.props.input_ref}
        onChange={async (event) => {
          const files = event.target.files || [];
          if (files.length === 0) return;

          const results: IUploadedJSON[] = [];
          for (let i = 0; i < files.length; i++) {
            const file = await this.readFile(files[i]);
            results.push(file);
          }
          this.props.onFileRead(results);
        }}
      />
    );
  }
}
