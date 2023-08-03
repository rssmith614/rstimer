const Scramble = ({ scramble, updateScramble }) => {
  
  return (
    <div className="p-2 m-2 fs-3" onClick={ updateScramble } style={{ cursor: 'pointer' }}>
      {scramble}
    </div>
  );
}

export default Scramble;