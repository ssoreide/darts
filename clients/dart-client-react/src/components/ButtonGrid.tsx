import React, { ReactElement, FC, useState } from "react";
import { TextField, Container, Paper, ButtonGroup, Button } from '@material-ui/core';
import { undoThrow } from "api";
import { UndoThrow } from "../../../../server/src/interfaces";
import { Multiplier } from "models/interfaces";
import DartBoard from './DartBoard';
import styled from "styled-components";

interface ButtonGridProps {
  gameId: string;
  sendScore: (field: number, multiplier?: Multiplier) => Promise<void>;
}

const StyledButtonGroup = styled(ButtonGroup)(prop => `
  margin: 10px 0px 20px 3px;
`)

const StyledPaper = styled(Paper)(prop => `
  padding: 6px;
`)

const ButtonGrid: FC<ButtonGridProps> = ({ gameId, sendScore }): ReactElement => {

  const [scoreField, setScoreField] = useState(0);
  const onKeyDown = async (ev: React.KeyboardEvent) => { 
    if (ev.key === 'Enter') {
      sendScore(scoreField, '1'); 
    }
  }

  const onChange = (ev: React.ChangeEvent) => {
    setScoreField((ev.target as any).value);
  }

  const doUndo = async () => {
    const doUndoThrow: UndoThrow = {
      gameid: gameId
    }
    await undoThrow(doUndoThrow);
  }

  return (
    <Container>
      <StyledPaper component="div">
        <TextField
          onFocus={ev => ev.target.select()}
          onKeyDown={onKeyDown}
          onChange={onChange}
          margin="dense"
          type="number"
          id="name"
          variant="outlined"
          label="Send score manually"
          value={scoreField} />
        <StyledButtonGroup
          orientation="horizontal"
          color="primary"
          aria-label="horizontal contained primary button group"
          variant="contained">
          <Button onClick={ev => sendScore(scoreField)}>Send</Button>
          <Button color="secondary" onClick={ev => doUndo()}>Undo</Button>
        </StyledButtonGroup>
        <DartBoard sendScore={sendScore}/>
      </StyledPaper>
    </Container>
  );
};
export default ButtonGrid;