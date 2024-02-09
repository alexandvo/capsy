import CapsuleListItem from "../components/CapsuleListItem";

const CapsuleList = () => {
  return (
    <>
      <CapsuleListItem
        title="Time Capsule #1"
        desc="This is the description lolz"
        date="1/27/2060"
      />
      <CapsuleListItem
        title="Time Capsule #2"
        desc="This is the description 2 lolz"
        date="3/2/2080"
      />
      <CapsuleListItem
        title="Time Capsule #3"
        desc="This is the description 3 lolz"
        date="8/30/2100"
      />
    </>
  );
};

export default CapsuleList;
