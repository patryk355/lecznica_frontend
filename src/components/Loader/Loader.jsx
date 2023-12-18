import { Triangle } from 'react-loader-spinner';

const Loader = ({ color }) => {
  return (
    <Triangle
      height='40'
      width='40'
      color={color}
      ariaLabel='triangle-loading'
    />
  );
};

export default Loader;
