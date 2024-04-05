const ContentItem = ({ ky, index, file, removeFileFunc }) => {
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
        alignItems: "center"
      }}
    >
      {file.type.startsWith("image/") && (
        <img
          style={{ width: "auto", height: "100%" }}
          src={URL.createObjectURL(file)}
          alt={file.name}
        />
      )}
      {file.type.startsWith("video/") && (
        <video
          style={{ width: "auto", height: "100%" }}
          src={URL.createObjectURL(file)}
          alt={file.name}
        />
      )}
      <div
        style={{ position: "absolute", top: "0px", right: "0px" }}
        id="minButton"
        onClick={() => removeFileFunc(index)}
      >
        <div className="crossPiece"></div>
        <div className="crossPiece"></div>
      </div>
    </div>
  );
};

export default ContentItem;
