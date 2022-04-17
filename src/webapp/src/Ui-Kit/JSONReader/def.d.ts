interface IJSONReaderProps {
  input_ref: React.RefObject<HTMLInputElement>;
  onFileRead: (files: IUploadedJSON[]) => void;
}
interface IUploadedJSON {
  name: string;
  value: any;
}
interface IUploadedHostList extends IUploadedJSON {
  value: {
    name: string;
    address: string;
    type: HostType;
    protocol: HostProtocol;
    ad_period: number;
  }[];
}
