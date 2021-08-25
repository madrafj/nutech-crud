const datauriToBlob = dturi => {
  let byte = atob(dturi.split(',')[1]);
  let mime = dturi.split(',')[0].split(':')[1].split(';')[0];

  let arBuf = new ArrayBuffer(byte.length);
  let intArr = new Uint8Array(arBuf);
  for (let i=0; i<byte.length; i++) {
    intArr[i] = byte.charCodeAt(i);
  }
  return new Blob([arBuf], {type: mime});
}

export default datauriToBlob;