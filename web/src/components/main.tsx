import { memo } from 'react';
import {useLoad, useTriggerLoad} from '../util/load';
import {useContext} from 'react';
import {ClientContext} from '../context/client-context';
import {add} from "../client/add";
import { AddResponse } from 'shared'
import { getProduct } from '../client/get-product';

export const Main = memo(() => {
    const client = useContext(ClientContext)

    const quoteLoad = useLoad(async (abort) => {
        const response = await fetch('https://bible-api.com/john 3:16', { signal: abort }).then((res) => res.json());
        return response.text
    }, []);

    const [addLoadState, doAdd] = useTriggerLoad<AddResponse | undefined>(async (abort) => {
        if (!client) {
            return
        }
        const response = await add(client, {a:1, b:2});
        return response;
    });

    const [searchProductLoad, doSearchProduct] = useTriggerLoad<string | undefined>(async (abort) => {
        if (!client) {
            return
        }
        const response = await getProduct(client, { id: "7507889750222" });
        return response?.result?.title;
    });

    if (quoteLoad.pending || !quoteLoad.value) {
        return <div>Loading...</div>;
    }

    else if (quoteLoad.error) {
        return <div>Error: {quoteLoad.error.message}</div>;
    }

    return (
        <>
        <div>
            <blockquote>{quoteLoad.value}</blockquote>
            {addLoadState.pending ? (
                <div>Adding...</div>
            ) : (
                <button onClick={() => { doAdd() }}>Add</button>
            )}
            {addLoadState.value && (
              <div>Hey, this is the value! {addLoadState.value?.result ?? 'undefined'}</div>
            )}
        </div>
        <div>
            {searchProductLoad.pending ? (
                <div>Getting product title...</div>
            ) : (
                <button onClick={() => { doSearchProduct() }}>Get product title</button>
            )}
            {searchProductLoad.value && (
                <div>The title of the product is {searchProductLoad.value ?? 'undefined'}</div>
            )}
        </div>
            </>
    );
});