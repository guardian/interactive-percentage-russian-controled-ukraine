import React from 'react'

const App = ({ content }) =>
<div id="scrolly-2">
<div class="scroll-wrapper">
    <div class="scroll-inner">
        <div id='gv-wrapper-2'>
            <div class="scroll-text__fixed-2 over">
                <hr class="hr-2"></hr>
                <h2 class="scroll-text__fixed__date">
                    {content[0].Header}
                </h2>
                <div class='date-wrapper'>
                    <p class='date'></p>
                    <p class='area'></p>
                </div>
                <div class="scroll-text__fixed__text">
                    <p>{content[0].Copy}</p>
                </div>
            </div>
               
        </div>
    </div>
    <div class="scroll-text">
            {
                content.map(element => {
                    return <div class="scroll-text__inner">
                        <div class="scroll-text__div">
                        </div>
                    </div>
                })
            }
            </div>
</div>
</div>

export default App