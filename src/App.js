import './App.css';
import axios from 'axios';
import { useState, useEffect } from 'react';



const squadre = [46,5,800,506,6195,398,12,6574,1038,276,252,1025,410,430,3522,1390,416,749,380,607,];
const squadreMini = [46,5,800];

function App() {

const [datiSquadra, setDatiSquadra] = useState([]);
const [squadra, setSquadra] = useState(46);
const [dati, setDati] = useState(null);
const [labelWin, setLabelWin] = useState({giuste:0, messaggio:"", corretta:true});
const [record, setRecord] = useState(0);
const [cambio, setCambio] = useState(false);
const [calciatore, setCalciatore] = useState(null);
const [calciatore2, setCalciatore2] = useState(null);
const [aggiorna, setAggiorna] = useState(-1);
const[maggiore, setMaggiore] = useState(true);
const url = 'https://transfermarket.p.rapidapi.com/clubs/get-squad';


const getAllData = async () => {
  
  datiSquadra.length > 0 && setDatiSquadra([]);
  let random = Math.floor(Math.random() * squadre.length);
  const { data } = await axios.get(url, {
    method: 'GET',
    params: {id: squadre[random]},
    headers: {
      'X-RapidAPI-Host': 'transfermarket.p.rapidapi.com',
      'X-RapidAPI-Key': '4f817f4bb6msh6e032e354e1ae92p1aa27djsncff60d5f250c',
      'content-type': 'application/json'
    }
  });
  if(aggiorna == -1){
    setAggiorna(0);
  }
  setDati(data.squad);

}


useEffect(() => {
  
  if(dati){
    let random = Math.floor(Math.random() * dati.length);
    let random2 = Math.floor(Math.random() * dati.length);
    switch(aggiorna){
      case 1:
        setCalciatore(dati[random]);
        break;
      case 2:
        setCalciatore2(dati[random2]);
        break;
      default:
        setCalciatore(dati[random]);
        setCalciatore2(dati[random2]);
        break;
    } 
   }
  setCambio(!cambio);
}, [dati])





const getData = async (id) => {

  (dati && setDati(null));
  const { data } = await axios.get(url, {
    method: 'GET',
    params: {id: id},
    headers: {
      'X-RapidAPI-Host': 'transfermarket.p.rapidapi.com',
      'X-RapidAPI-Key': '4f817f4bb6msh6e032e354e1ae92p1aa27djsncff60d5f250c',
      'content-type': 'application/json'
    }
  });

  setDatiSquadra(data.squad);

}

useEffect(() => {

  if(datiSquadra.length > 0){
    console.log('Use Effect datiSquadra');
    console.log(datiSquadra);
    const random = Math.floor(Math.random() * datiSquadra.length);
    setCalciatore(datiSquadra[random]);
    const random2 = Math.floor(Math.random() * datiSquadra.length);
    setCalciatore2(datiSquadra[random2]);
    setCambio((cambio) => !cambio);
  }

}, [datiSquadra]);


useEffect(() => {
  
  console.log('Use Effect Cambio');
  if(calciatore && calciatore2)
  {
    if(maggiore){
      if(Number(calciatore.marketValue.value) >= Number(calciatore2.marketValue.value)) {
        setCalciatore(prevCalciatore =>({...prevCalciatore, giusto:true})); 
        setCalciatore2(prevCalciatore2 =>({...prevCalciatore2, giusto: false}))
      } else {
        setCalciatore2(prevCalciatore2 =>({...prevCalciatore2, giusto: true}))
        setCalciatore(prevCalciatore =>({...prevCalciatore, giusto:false})); 
      } 
    } else {
      if(Number(calciatore.marketValue.value) <= Number(calciatore2.marketValue.value)) {
        setCalciatore(prevCalciatore =>({...prevCalciatore, giusto:true})); 
        setCalciatore2(prevCalciatore2 =>({...prevCalciatore2, giusto: false}))
      } else {
        setCalciatore2(prevCalciatore2 =>({...prevCalciatore2, giusto: true}))
        setCalciatore(prevCalciatore =>({...prevCalciatore, giusto:false})); 

    }
  }

}

}, [cambio])



useEffect(() => {

  if(aggiorna != -1 && aggiorna != 0){
    getAllData();
  }

}, [aggiorna])





const ricomincia = async () => {

  setLabelWin({giuste:0, corretta:false, messaggio:''});
  const random = Math.floor(Math.random() * datiSquadra.length);
  setCalciatore(datiSquadra[random]);
  const random2 = Math.floor(Math.random() * datiSquadra.length);
  setCalciatore2(datiSquadra[random2]);
  setLabelWin({giuste:0, messaggio:'', corretta:true});
  setCambio(!cambio);  
  

}

const handleSubmit = (giusto, posizione) => {

if(aggiorna == -1){  if(!labelWin.corretta){
    setLabelWin({...labelWin, messaggio: 'Ricomincia per giocare!'});
    return;
  }
  if(giusto){
    if(record < labelWin.giuste+1){
      setRecord(record+1);
    }
    setLabelWin((prev) => ({
      messaggio: "Risposta corretta!",
      corretta: true,
      giuste: prev.giuste + 1,
    }));
    const random = Math.floor(Math.random() * datiSquadra.length);
    if(posizione == 1){
      setCalciatore2(datiSquadra[random]);
    } else {
      setCalciatore(datiSquadra[random]);
    }
  } else {

    setLabelWin((prev) => ({
      messaggio: "Risposta errata!",
      corretta: false,
      giuste: prev.giuste,
    }))
    
  }
  setMaggiore(!maggiore);
  setCambio(!cambio);
} else {
  //SE GIOCHIAMO CON TUTTE LE SQUADRE
  if(!labelWin.corretta){
    setLabelWin({...labelWin, messaggio: 'Ricomincia per giocare!'});
    return;
  }
  if(giusto){
    if(record < labelWin.giuste+1){
      setRecord(record+1);
    }
    setLabelWin((prev) => ({
      messaggio: "Risposta corretta!",
      corretta: true,
      giuste: prev.giuste + 1,
    }));
    const random = Math.floor(Math.random() * datiSquadra.length);
    if(posizione == 1){
      setAggiorna(1);
    } else {
      setAggiorna(2);
    }
  } else {

    setLabelWin((prev) => ({
      messaggio: "Risposta errata!",
      corretta: false,
      giuste: prev.giuste,
    }))
    
  }
  setMaggiore(!maggiore);
  setCambio(!cambio);

}
}


  return (
    <div className="App">

<select onChange={(e)=> setSquadra(e.target.value)}>
<option value="46">Inter</option>
<option value="5">Milan</option>
<option value="800">Atalanta</option>
<option value="506">Juventus</option>
<option value="6195">Napoli</option>
<option value="398">Lazio</option>
<option value="12">Roma</option>
<option value="6574">Sassuolo</option>
<option value="1038">Sampdoria</option>
<option value="276">Verona</option>
<option value="252">Genoa</option>
<option value="1025">Bologna</option>
<option value="410">Udinese</option>
<option value="430">Fiorentina</option>
<option value="3522">Spezia</option>
<option value="1390">Cagliari</option>
<option value="416">Torino</option>
<option value="749">Empoli</option>
<option value="380">Salernitana</option>
<option value="607">Venezia</option>
</select>
      <button onClick={() => getData(squadra)}>GIOCA CON UNA SOLA SQUADRA</button>
      {(datiSquadra.length>20) && (
      <button onClick={() => ricomincia()}>RICOMINCIA</button>
)}
<button onClick={() => getAllData()}>GIOCA CON TUTTE</button>

      {(calciatore && calciatore2) ? (
        <div>
         
          <h1>{labelWin.messaggio}</h1>
          <h4>Giuste: {labelWin.giuste} - Record: {record} </h4>
          <hr />
          <h1>{(maggiore ? 'CHI HA IL VALORE DI MERCATO MAGGIORE?': 'CHI HA IL VALORE DI MERCATO MINORE?')}</h1>
          <hr />
          <div className='row'>
          <div className='col-md-6'> 
          <h2>{calciatore.name}</h2>
          <img className={labelWin.corretta && (calciatore.giusto ? 'corretta': 'sbagliata')}  src={calciatore.heroImage ?? calciatore.image} onClick={()=> handleSubmit(calciatore.giusto,1)} />
  {(1==2) && (       
          <h5>{calciatore.giusto ? 'Giusto' : 'Non giusto'} - {calciatore.marketValue.value}</h5>
  )}       
        </div>
        <div className='col-md-6'> 
        <hr className='divisore'/> 
          <h2>{calciatore2.name}</h2>
          <img className={labelWin.corretta && (calciatore2.giusto ? 'corretta': 'sbagliata')} src={calciatore2.heroImage ?? calciatore2.image} onClick={() => handleSubmit(calciatore2.giusto,2)} />
  {(1==2) && (
          <h5>{calciatore2.giusto ? 'Giusto' : 'Non giusto'} - {calciatore2.marketValue.value}</h5>
  )}
          </div>
        </div>
        </div>
      ) : (
        <div>
<p>Nessun Dato caricato</p>
        </div>
      )}

    </div>
  );
}

export default App;
