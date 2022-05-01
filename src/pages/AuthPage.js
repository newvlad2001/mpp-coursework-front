import React, {useState} from "react";
import LoginLayout from "../layouts/auth/LoginLayout";
import RegisterLayout from "../layouts/auth/RegisterLayout";

function AuthPage() {
    const [login, setLogin] = useState(true);


    function handleLink() {
        setLogin(!login);
    }

    return (
        <React.Fragment>
            {
                login ? <LoginLayout handleLink={handleLink}/> : <RegisterLayout handleLink={handleLink}/>
            }
        </React.Fragment>
    )
}

export default AuthPage;