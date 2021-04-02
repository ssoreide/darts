import React, { ReactElement, FC } from "react";
import { Container } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Pie from './DartBoardPie';
import DartBoardNumber from './DartBoardNumber';
import { Multiplier } from "models/interfaces";
import styled from "styled-components";

const useStyles = makeStyles(theme => ({
  bullsEye: {
    width: '20px',
    height: '20px',
    border: '2px solid #ddd',
    borderRadius: '20px',
    position: 'absolute',
    left: '288px',
    top: '288px',
    background: '#a33',
    boxShadow: '0 0 5px rgb(0 0 0 / 80%)'
  },
  root: {
    padding: '20px',
    transform: 'scale(0.9)',
    marginTop: '-40px'
  }
}));

interface DartBoardProps {
  sendScore: (field: number, multiplier?: Multiplier) => Promise<void>
}

const DartBoardWrapper = styled.div`
  width: 600px;
  height: 600px;
  background: #333;
  border-radius: 600px;
  position: relative;
  margin: 0 auto;
  box-shadow: 0 0 10px rgb(0 0 0 / 80%);
`
const OuterBorder = styled.div`
  width: 582px;
  height: 582px;
  border-radius: 580px;
  pointer-events: none;
  left: 9px;
  top: 9px;
  border: 2px solid #ddd;
  position: absolute;
`
const RingOne = styled.div`
  width: 446px;
  height: 446px;
  border-radius: 450px;
  overflow: hidden;
  border: 2px solid #ddd;
  position: absolute;
  left: 75px;
  top: 75px;
  background: #363;
  box-shadow: inset 0 0 5px rgb(0 0 0 / 80%);
`
const RingTwo = styled.div`
  width: 416px;
  height: 416px;
  border: 2px solid #ddd;
  border-radius: 420px;
  overflow: hidden;
  position: absolute;
  left: 90px;
  top: 90px;
  background: #eec;
  box-shadow: inset 0 0 5px rgb(0 0 0 / 80%);
`
const RingThree = styled.div`
  width: 300px;
  height: 300px;
  border: 2px solid #ddd;
  border-radius: 300px;
  overflow: hidden;
  position: absolute;
  left: 148px;
  top: 148px;
  background: #363;
  box-shadow: inset 0 0 5px rgb(0 0 0 / 80%);
`
const RingFour = styled.div`
  width: 270px;
  height: 270px;
  border: 2px solid #ddd;
  border-radius: 270px;
  overflow: hidden;
  position: absolute;
  left: 163px;
  top: 163px;
  background: #eec;
  box-shadow: inset 0 0 5px rgb(0 0 0 / 80%);
`
const SemiBullsEye = styled.div` 
  width: 48px;
  height: 48px;
  border: 2px solid #ddd;
  border-radius: 48px;
  position: absolute;
  left: 274px;
  top: 274px;
  background: #363;
  box-shadow: 0 0 5px rgb(0 0 0 / 80%);
  cursor: pointer;
  &:hover {
    background: white;
  }
`
const BullsEye = styled.div`
  width: 20px;
  height: 20px;
  border: 2px solid #ddd;
  border-radius: 20px;
  position: absolute;
  left: 288px;
  top: 288px;
  background: #a33;
  box-shadow: 0 0 5px rgb(0 0 0 / 80%);
  cursor: pointer;
  &:hover {
    background: white;
  }
`

const DartBoard: FC<DartBoardProps> = ({ sendScore }): ReactElement => {

  const styles = useStyles();
  const northNumbers = [1,4,5,6,9,11,12,13,14,18,20];
  const southNumbers = [8,16,7,19,3,17,2,15,10];
  const pies = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20];
  const numberRotateValues: Record<number, number> = {
    1: 18,
    2: -36,
    3: 0,
    4: 54,
    5: -18,
    6: 90,
    7: 36,
    8: 72,
    9: -54,
    10: -72,
    11: -90,
    12: -36,
    13: 72,
    14: -72,
    15: -54,
    16: 54,
    17: -18,
    18: 36,
    19: 18,
    20: 0
  }
  const pieToNumberMap: Record<number, number> = {
    1: 20, 
    2: 1,
    3: 18,
    4: 4,
    5: 13,
    6: 6,
    7: 10,
    8: 15,
    9: 2, 
    10: 17,
    11: 3,
    12: 19,
    13: 7,
    14: 16,
    15: 8,
    16: 11,
    17: 14,
    18: 9,
    19: 12,
    20: 5
  }
  const startValue = -99;
  const degreePitch = 18;
  const pieRotateValues: Record<number, number> = {};
  for (const pie of pies) {
    pieRotateValues[pie] = startValue + (pie * degreePitch);
  }

  return (
    <Container className={styles.root}> 
      <div className={styles.root}>
        <DartBoardWrapper>
          <RingOne>
            {/* The outer doubles */}
            { pies.map(n => <Pie key={n} number={pieToNumberMap[n]} size={223} color={n % 2 === 0 ? '#363' : '#a33'} rotate={pieRotateValues[n]} onClick={field => sendScore(field, '2')} />)}
          </RingOne>
          <RingTwo>
            {/* The outer pies */}
            { pies.map(n => <Pie key={n} number={pieToNumberMap[n]} size={208} color={n % 2 === 0 ? '#eec' : '#333'} rotate={pieRotateValues[n]} onClick={field => sendScore(field, '1')}/>)}
          </RingTwo>
          <RingThree>
            {/* The inner triples  */}
            { pies.map(n => <Pie key={n} number={pieToNumberMap[n]} size={150} color={n % 2 === 0 ? '#363' : '#a33'} rotate={pieRotateValues[n]} onClick={field => sendScore(field, '3')}/>)}
          </RingThree>
          <RingFour>
            {/* The inner pies  */}
            { pies.map(n => <Pie key={n} number={pieToNumberMap[n]} size={135} color={n % 2 === 0 ? '#eec' : '#333'} rotate={pieRotateValues[n]} onClick={field => sendScore(field, '1')}/>)}
          </RingFour>
          <SemiBullsEye onClick={ev => sendScore(25)}/>
          <BullsEye onClick={ev => sendScore(50)}/>
          <OuterBorder />
          {/* The numbers around the board */}
          { northNumbers.map(n => <DartBoardNumber key={n} number={n} location={'top'} rotate={numberRotateValues[n]}/>)}
          { southNumbers.map(n => <DartBoardNumber key={n} number={n} location={'bottom'} rotate={numberRotateValues[n]}/>)}
        </DartBoardWrapper>
      </div>
    </Container>
  );
};

export default DartBoard;