export declare class Transformer {
    blob2ObjectURL(blobData: Blob): string;
    binaryString2dataURL(binaryString: string, type?: string): string;
    dataURL2binaryString(dataURL: string): {
        binaryString: string;
        type: string;
    };
    toBlob(data: BlobPart, type?: string): Blob;
    dataURL2Blob(dataURL: string): Blob;
    private _readerPromise;
    blob2ArrayBuffer(blobData: Blob): Promise<string | ArrayBuffer>;
    blob2BinaryString(blobData: Blob): Promise<string | ArrayBuffer>;
    blob2DataURL(blobData: Blob): Promise<string | ArrayBuffer>;
    blob2Text(blobData: Blob): Promise<string | ArrayBuffer>;
}
export declare const transformer: Transformer;
export default transformer;
//# sourceMappingURL=Transformer.d.ts.map