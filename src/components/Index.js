import React, { useReducer } from 'react';
import '../App.css'
import DigitButton from './DigitButton';
import OperationButton from './OperationButton';

export const ACTIONS = {
    ADD_DIGIT : 'add-digit',
    CHOOSE_OPERATION :'choose_operation',
    CLEAR : 'clear',
    DELETE_DIGIT :'delete_digit',
    EVALUATE : 'evaluate'
}

function reducer(state,{type,payload}){
    switch(type){
        case ACTIONS.ADD_DIGIT:
            if(state.overWrite){
                return {
                    ...state,
                    currentOperand : payload.digit,
                    overWrite :false
                }
            }
            if(payload.digit === "0" && state.currentOperand === "0") return state
            if(payload.digit === '.' && state.currentOperand.includes('.')) return state
            return {
                ...state,
                currentOperand : `${state.currentOperand||""}${payload.digit}` ,
            } 

        case ACTIONS.CHOOSE_OPERATION:
            if(state.currentOperand===null && state.previousOperand === null) {
                return state
            }

            if(state.currentOperand == null){
                return{
                    ...state,
                    operation : payload.operation,
                }
            }

            if(state.previousOperand == null){
                return{
                    ...state,
                    operation : payload.operation,
                    previousOperand : state.currentOperand,
                    currentOperand : null,
                }
            }
            return {
                ...state,
                previousOperand : evaluate(state),
                currentOperand :null,
                operation :payload.operation

            }
            

        case ACTIONS.CLEAR:
            return {}

        case ACTIONS.DELETE_DIGIT:
            if(state.overWrite){
               return{
                ...state,
                currentOperand :null,
                overWrite :false
               }
            }
            return{
                ...state,
                currentOperand : state.currentOperand.slice(0,-1)
            }

        

        case ACTIONS.EVALUATE:
            if(state.previousOperand==null){
                return {
                    ...state,
                    currentOperand :state.currentOperand,
                    overWrite :true
                }
            }
            if(state.currentOperand==null || state.previousOperand==null || state.operation==null  ){
                return state
            }
            
            return {
                ...state,
                overWrite :true,
                previousOperand : null,
                currentOperand :evaluate(state),
                operation :null
            }


        
    }
}

const INTEGER_FORMATTER = new Intl.NumberFormat("en-us",{
    maximumFractionDigits: 0,
})

function formatOperand(operand){
    if(operand == null) return
    const [integer, decimal] = operand.split('.')
    if(decimal == null) return INTEGER_FORMATTER.format(integer)
    return `${INTEGER_FORMATTER.format(integer)}.${decimal}`
    
}

function evaluate({currentOperand, previousOperand,operation}){
    const current = parseFloat(currentOperand)
    const previous = parseFloat(previousOperand)
    if(isNaN(previous) || isNaN(current)){
        return ""
    }
    let computation = ""
    switch(operation){
        case '+':
            computation = previous + current
            break
        case '-':
            computation = previous - current
            break
        case '*':
            computation = previous * current
            break
        case '/':
            computation = previous / current
            break
    }
    return computation.toString()

}

function Index() {
    const [{currentOperand, previousOperand, operation}, dispatch] = useReducer(reducer, {})
    return <>
        <div className='calculator-grid'>
            <div className='output'>
                <div className='previous-operand'>{formatOperand(previousOperand)} {operation}</div>
                <div className='current-operand'>{formatOperand(currentOperand)}</div>             
            </div>
            <button className='span-two' onClick={()=>dispatch({type:ACTIONS.CLEAR})}>AC</button>
            <button onClick={()=>dispatch({type:ACTIONS.DELETE_DIGIT})}>DEL</button>
            <OperationButton operation="/" dispatch={dispatch} />
            <DigitButton digit="1" dispatch={dispatch} />
            <DigitButton digit="2" dispatch={dispatch} />
            <DigitButton digit="3" dispatch={dispatch} />
            <OperationButton operation="*" dispatch={dispatch} />
            <DigitButton digit="4" dispatch={dispatch} />
            <DigitButton digit="5" dispatch={dispatch} />
            <DigitButton digit="6" dispatch={dispatch} />
            <OperationButton operation="+" dispatch={dispatch} />
            <DigitButton digit="7" dispatch={dispatch} />
            <DigitButton digit="8" dispatch={dispatch} />
            <DigitButton digit="9" dispatch={dispatch} />
            <OperationButton operation="-" dispatch={dispatch} />
            <DigitButton digit="." dispatch={dispatch} />
            <DigitButton digit="0" dispatch={dispatch} />
            <button className='span-two' onClick={()=>dispatch({type:ACTIONS.EVALUATE})}>=</button>

        </div>
  </>;
}

export default Index;
