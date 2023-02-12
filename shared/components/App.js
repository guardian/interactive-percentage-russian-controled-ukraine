import React from 'react'

const App = ({ content }) =>
    <div id="scrolly-1">
        <div class="scroll-wrapper">
            <div class="scroll-inner">
                <div id='gv-wrapper'>
                     <div class="header-wrapper">
                        <div class="header-background"></div>
                        <div class="header-wrapper__content">
                            <div class='loader'>Loading</div>
                            <h1 class="content__headline"></h1>
                            <div class="scroll-text__fixed__header"></div>
                            <div class="header-wrapper__byline"></div>
                            <div class="header-wrapper__date"></div>
                        </div>
                    </div>

                    <div class="scroll-text__fixed over">
                        <hr class="hr"></hr>
                        <h2 class="scroll-text__fixed__date"></h2>
                        <div class="scroll-text__fixed__text"></div>
                    </div>

                    <div class="scroll-text__wrapper"></div>
                </div>
            </div>
            <div class="scroll-text">
            {
                content.map(element => {
                    return <div class="scroll-text__inner">
                        <div class="scroll-text__div"></div>
                    </div>
                })
            }
            </div>
        </div>
    </div>

export default App