import { useState } from "react";

function Translate() {

    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');

    const handleTranslate = async () => {
        const data = await fetch(`https://innohacks-ml.devrahulsingh.tech/translate?q=${input}&src=auto&dest=hi`)
        const jsdata = await data.json();
        setOutput(jsdata);
    }

    return <div>
        <input type="text" value={input} onChange={(e) => setInput(e.target.value)} />
        <button onClick={handleTranslate}>Translate</button>
        <input type="text" value={output} onChange={e => setOutput(e.target.value)} />
    </div>
}

export default Translate;