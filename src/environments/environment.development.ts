let env: any = {
  production: false,

  apiurl: `http://4.247.144.208:8080/api`,
  media: `http://4.247.144.208:8080/`,
  //   apiurl: `http://192.168.137.129:80/api`,
  // media: `http://192.168.137.129:80/`,
  devtype:`QC`,

}
if (typeof window !== 'undefined') {
  //  env = {
  //     production: true,
  //     apiurl: `http://${window.location.hostname}:${window.location.port}/api`,
  //     media: `http://${window.location.hostname}:${window.location.port}`,
  //   //  devtype:`Dev` 
  //   // devtype:`QC` 
  //    devtype:`QC`
  //  }
}
export const environment = env