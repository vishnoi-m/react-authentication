import { useState, useRef, useContext } from "react";
import { useHistory } from "react-router-dom";
import AuthContext from "../../store/auth-context";

import classes from "./AuthForm.module.css";

const AuthForm = () => {
  const emailInputRef = useRef();
  const passwordInputRef = useRef();
  const history = useHistory();
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsloading] = useState(false);
  const authCtx = useContext(AuthContext);
  const switchAuthModeHandler = () => {
    setIsLogin((prevState) => !prevState);
  };

  const submitHandler = (event) => {
    event.preventDefault();
    const enteredEmail = emailInputRef.current.value;
    const enteredPassword = passwordInputRef.current.value;

    setIsloading(true);
    if (isLogin) {
      fetch(
        "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyDjKjUwXIkxYfDJfl9U_nA09D-CZqSAvpE",
        {
          method: "POST",
          body: JSON.stringify({
            //as the above api expecting three inputs that we have entered below
            email: enteredEmail,
            password: enteredPassword,
            returnSecureToken: true,
          }),
          headers: {
            "Content-Type": "application/json", //to ensure that the Auth REST API knows that we got some JSON data coming in here.
          },
        }
      )
        .then((res) => {
          setIsloading(false);
          if (res.ok) {
            return res.json();
          } else {
            // Just like fetch method, response.JSON also returns a promise.So we also call .then here.
            return res.json().then((data) => {
              let errorMessage = "Authentication Fail";
              if (data && data.error && data.error.message) {
                errorMessage = data.error.message;
              }
              throw new Error(errorMessage);
            });
          }
        })
        .then((data) => {
          const expirationTime = new Date(
            new Date().getTime() + +data.expiresIn * 1000
          );
          authCtx.login(data.idToken, expirationTime.toISOString());
          history.replace("/");
        })
        .catch((err) => {
          alert(err.message);
        });
    } else {
      //Not in Login Mode
      fetch(
        "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyDjKjUwXIkxYfDJfl9U_nA09D-CZqSAvpE",
        {
          method: "POST",
          body: JSON.stringify({
            //as the above api expecting three inputs that we have entered below
            email: enteredEmail,
            password: enteredPassword,
            returnSecureToken: true,
          }),
          headers: {
            "Content-Type": "application/json", //to ensure that the Auth REST API knows that we got some JSON data coming in here.
          },
        }
      ).then((res) => {
        setIsloading(false);
        if (res.ok) {
          // ... do something
        } else {
          // Just like fetch method, response.JSON also returns a promise.So we also call .then here.
          return res.json().then((data) => {
            let errorMessage = "Authentication Fail";
            if (data && data.error && data.error.message) {
              errorMessage = data.error.message;
            }
            alert(errorMessage);
          });
        }
      });
    }
  };

  return (
    <section className={classes.auth}>
      <h1>{isLogin ? "Login" : "Sign Up"}</h1>
      <form onSubmit={submitHandler}>
        <div className={classes.control}>
          <label htmlFor="email">Your Email</label>
          <input type="email" id="email" required ref={emailInputRef} />
        </div>
        <div className={classes.control}>
          <label htmlFor="password">Your Password</label>
          <input
            type="password"
            id="password"
            required
            ref={passwordInputRef}
          />
        </div>
        <div className={classes.actions}>
          {!isLoading && (
            <button>{isLogin ? "Login" : "Create Account"}</button>
          )}
          {isLoading && <p>Sending Request...</p>}
          <button
            type="button"
            className={classes.toggle}
            onClick={switchAuthModeHandler}
          >
            {isLogin ? "Create new account" : "Login with existing account"}
          </button>
        </div>
      </form>
    </section>
  );
};

export default AuthForm;
