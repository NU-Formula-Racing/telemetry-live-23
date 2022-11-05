import { useState, useContext } from 'react';
import styled from 'styled-components';

import BasicContainer from '../shared/BasicContainer';
import { Context } from '../shared/Context';

export default function NameInput(props) {
let context = useContext(Context);
  let [focus, setFocus] = useState(false);
  let [input, setInput] = useState('');

  const handleKeyPress = (e) => {
      if (e.keyCode === 13) {
          e.target.blur();
          context.setSession(input)
      }
  }

  const handleBlur = () => {
      setFocus(false);
      props.setSessionName(input);
      context.setSession(input)
  }

  return(
    <BasicContainer flex>
        <StyledInput 
            type="text" 
            placeholder = "Enter Session Name"
            value={input}
            onInput={(e) => setInput(e.target.value)}
            onFocus={(e) => setFocus(true)}
            onBlur={(e) => handleBlur()}
            onKeyDown={(e) => {handleKeyPress(e)}}
            focus={focus}
        />
    </BasicContainer>
  );
}

const StyledInput = styled.input`
    border: none;
    padding-top: 3px;
    width: 100%;
    font-weight: ${props => (props.focus ? "normal" : "bold")} ;
    ::placeholder {
        font-weight: normal;
    }
    text-overflow: ellipsis;
    :focus {
        outline: none;
    }
`;