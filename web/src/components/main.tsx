import { memo } from 'react';
import {useLoad, useTriggerLoad} from '../util/load';
import {useContext} from 'react';
import {ClientContext} from '../context/client-context';
import {add} from "../client/add";

export const Main = memo(() => {
    const client = useContext(ClientContext);

    const quoteLoad = useLoad(async (abort) => {
        console.log('hehehehe')
        const response = await fetch('https://bible-api.com/john 3:16', { signal: abort }).then((res) => res.json());
        return response.text
    }, []);

    const [_addLoadState, doAdd] = useTriggerLoad(async (abort) => {
        if (!client) {
            return
        }
        const response = await add(client, {a:1, b:2});
        return response;
    });

    if (quoteLoad.pending || !quoteLoad.value) {
        return <div>Loading...</div>;
    }

    else if (quoteLoad.error) {
        return <div>Error: {quoteLoad.error.message}</div>;
    }

    return (
        <div>
            <blockquote>{quoteLoad.value}</blockquote>
            <button onClick={() => { doAdd() }}>Add</button>
        </div>
    );
});