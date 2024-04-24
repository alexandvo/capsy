import ResizingImage from "./ResizingImage";

const ContentItem = ({ index, fileObj, removeFileFunc }) => {
  const file = fileObj.rawFile;
  const isCover = fileObj.isCover;
  return (
    <div
      style={{
        listStyle: "none",
        width: "100px",
        aspectRatio: 1 / 1,
        position: "relative",
        overflow: "hidden",
        margin: "10px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        border: isCover ? "4px solid red" : "" 
      }}
    >
      <ResizingImage type='image' src={URL.createObjectURL(file)} alt='content item' size={100} swap={true}/>

      {/* {file.type.startsWith("image/") && (
        <img
          style={{ width: "auto", height: "100%" }}
          src={URL.createObjectURL(file)}
          alt={file.name}
        />
      )} */}

      
      {/* {file.type.startsWith("video/") && (
        <video
        controls
          style={{ width: "auto", height: "100%" }}
          src={URL.createObjectURL(file)}
          alt={file.name}
        />
      )} */}
      <div
        style={{ position: "absolute", top: "0px", right: "0px"}}
        id="contentMinButton"
        onClick={() => removeFileFunc(index, isCover)}
      >
        <div className="crossPiece"></div>
        <div className="crossPiece"></div>
      </div>
    </div>
  );
};

export default ContentItem;
