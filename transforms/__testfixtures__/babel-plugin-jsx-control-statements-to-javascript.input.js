function MyComp1() {
    return (
      <If condition={true}>
        one
        {"two"}
        <span>three</span>
        <span>four</span>
      </If>
    );
  }
  
  function MyComp2() {
    return (
      <span>
        <If condition={true}>
          one
          {"two"}
          <span>three</span>
          <span>four</span>
        </If>
      </span>
    );
  }
  