import React from 'react'
import { Container } from './style';
import { CSSTransition } from 'react-transition-group';
import { useState } from 'react';

function Album(props) {
    const [showStatus, setShowStatus] = useState(true)
    return (
        <CSSTransition
            in={showStatus}  
            timeout={300} 
            classNames="fly" 
            appear={true} 
            unmountOnExit
            onExited={props.history.goBack}
        >
            <Container>
                <div>
                    <h1>hello world</h1>
                </div>
            </Container>   
        </CSSTransition>
    )
}

export default React.memo(Album)