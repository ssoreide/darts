import React, { ReactElement, FC, useState } from "react";
import { TextField, Container, Paper, ButtonGroup, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { undoThrow } from "api";
import { UndoThrow } from "../../../../server/src/interfaces";
import { Multiplier } from "models/interfaces";
import DartBoard from './DartBoard';

const useStyles = makeStyles(theme => ({
  buttonGroup: {
    marginTop: '10px',
    marginLeft: '3px',
    marginBottom: '20px'
  },
  root: {
    padding: '5px'
  }
}));

interface ButtonGridProps {
  gameId: string;
  sendScore: (field: number, multiplier?: Multiplier) => Promise<void>;
}

const ButtonGrid: FC<ButtonGridProps> = ({ gameId, sendScore }): ReactElement => {

  const styles = useStyles();
  const [scoreField, setScoreField] = useState(0);

  const buttons: number[] = [];
  for (let i = 1; i < 21; i++) {
    buttons.push(i);
  }

  const onKeyDown = async (ev: React.KeyboardEvent) => {
    if (ev.key === 'Enter' && isValidField(scoreField)) {
      sendScore(scoreField, '1');
    }
  }

  const isValidField = (field: number) => {
    return [...buttons, 25, 50].includes(field);
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
    <Container className={styles.root}>
      <Paper component="form" className={styles.root}>
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
        <ButtonGroup
          className={styles.buttonGroup}
          orientation="horizontal"
          color="primary"
          aria-label="horizontal contained primary button group"
          variant="contained">
          <Button onClick={ev => sendScore(scoreField)}>Send</Button>
          <Button color="secondary" onClick={ev => doUndo()}>Undo</Button>
        </ButtonGroup>
        <DartBoard sendScore={sendScore}/>
      </Paper>
    </Container>
  );
};
export default ButtonGrid;