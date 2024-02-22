import { useState } from 'react';
import './MainFrame.css'

export default function MainFrame() {
    const [detailInfo, setDetailInfo] = useState("Today");
    const [selectMode, setSelectMode]  = useState(1);
    return (
        <div className='container'>
            <div className='upperBar'>
                <h1 className='title'>ScheduSmart</h1>
                <button className='upperBarButton'>setting</button>
                <button className='upperBarButton'>logout</button>
            </div>
            <div className='calender_background'> 
                <h2 className='detailInfo'>{detailInfo}</h2>
                <button className='modeButton' id='1' onClick={()=>{
                    setSelectMode(1);
                    document.getElementById('1').style.backgroundColor = "#cfcfcf";
                    document.getElementById('2').style.backgroundColor = "#2d2d2d";
                    document.getElementById('3').style.backgroundColor = "#2d2d2d";
                    document.getElementById('4').style.backgroundColor = "#2d2d2d";
                }}>day</button>
                <button className='modeButton' id='2' onClick={() => {
                    setSelectMode(2);
                    document.getElementById('1').style.backgroundColor = "#2d2d2d";
                    document.getElementById('2').style.backgroundColor = "#cfcfcf";
                    document.getElementById('3').style.backgroundColor = "#2d2d2d";
                    document.getElementById('4').style.backgroundColor = "#2d2d2d";
                }}>week</button>
                <button className='modeButton' id='3' onClick={() => {
                    setSelectMode(3);
                    document.getElementById('1').style.backgroundColor = "#2d2d2d";
                    document.getElementById('2').style.backgroundColor = "#2d2d2d";
                    document.getElementById('3').style.backgroundColor = "#cfcfcf";
                    document.getElementById('4').style.backgroundColor = "#2d2d2d";
                }}>month</button>
                <button className='modeButton' id='4' onClick={() => {
                    setSelectMode(4);
                    document.getElementById('1').style.backgroundColor = "#2d2d2d";
                    document.getElementById('2').style.backgroundColor = "#2d2d2d";
                    document.getElementById('3').style.backgroundColor = "#2d2d2d";
                    document.getElementById('4').style.backgroundColor = "#cfcfcf";
                }}>year</button>
                <div className='calender_container'>
                    <div style={{ display: selectMode === 1 ? 'block' : 'none' }}>
                        <div className='dayBox'>
                            <hr className='dayLine'/>
                            <hr className='dayLine'/>
                            <hr className='dayLine'/>
                            <hr className='dayLine'/>
                            <hr className='dayLine'/>
                            <hr className='dayLine'/>
                            <hr className='dayLine'/>
                            <hr className='dayLine'/>
                            <hr className='dayLine'/>
                            <hr className='dayLine'/>
                            <hr className='dayLine'/>
                            <hr className='dayLine'/>
                        </div>
                        <div className='daytimebox'>
                            <p className='dayWord'>1:00</p>
                            <p className='dayWord'>3:00</p>
                            <p className='dayWord'>5:00</p>
                            <p className='dayWord'>7:00</p>
                            <p className='dayWord'>9:00</p>
                            <p className='dayWord'>11:00</p>
                            <p className='dayWord'>13:00</p>
                            <p className='dayWord'>15:00</p>
                            <p className='dayWord'>17:00</p>
                            <p className='dayWord'>19:00</p>
                            <p className='dayWord'>21:00</p>
                            <p className='dayWord'>23:00</p>
                        </div>
                    </div>
                    <div style={{ display: selectMode === 2 ? 'block' : 'none' }}><p>Div 2 context</p></div>
                    <div style={{ display: selectMode === 3 ? 'block' : 'none' }}><p>Div 3 context</p></div>
                </div>
            </div>
            <div className='event'></div>
        </div>
    )
}