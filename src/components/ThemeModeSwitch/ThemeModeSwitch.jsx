import { useContext } from 'react';
import { AppContext } from '../../context/appContext';
import MoonIcon from '../../icons/MoonIcon';
import SunIcon from '../../icons/SunIcon';

import './ThemeModeSwitch.scss';

const ThemeModeSwitch = () => {
  const { darkMode, onChangeThemeMode } = useContext(AppContext);

  const onChangeModeHandler = (e) => {
    const value = e.target.checked;
    onChangeThemeMode(value);
  };

  return (
    <div id='theme_mode_switch_container'>
      <input
        type='checkbox'
        id='theme-mode-switch'
        name='mode'
        onChange={onChangeModeHandler}
        checked={darkMode}
      />
      <label
        htmlFor='theme-mode-switch'
        title={darkMode ? 'Tryb jasny' : 'Tryb ciemny'}
      >
        {darkMode ? <SunIcon /> : <MoonIcon />}
      </label>
    </div>
  );
};

export default ThemeModeSwitch;
