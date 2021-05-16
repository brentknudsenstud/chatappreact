import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { Button } from "semantic-ui-react";
import { useAuthContext, GlobalActionTypes } from '../../dataLayer/auth';


export function About(props) {
    const { state = {}, dispatch } = useAuthContext();

    return (
        <>
            <h1>About</h1>
        </>
    );
}