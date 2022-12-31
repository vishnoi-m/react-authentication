import { useRef, useContext } from "react";
import { useHistory } from "react-router-dom";
import AuthContext from "../../store/auth-context";
import classes from "./ProfileForm.module.css";

const ProfileForm = () => {
  const inputNewPasswordRef = useRef();
  const authCtx = useContext(AuthContext);
  const token = authCtx.token;
  const history = useHistory();

  const submithandler = (event) => {
    event.preventDefault();

    const enteredNewPassword = inputNewPasswordRef.current.value;

    fetch(
      "https://identitytoolkit.googleapis.com/v1/accounts:update?key=AIzaSyDjKjUwXIkxYfDJfl9U_nA09D-CZqSAvpE",
      {
        method: "POST",
        body: JSON.stringify({
          idToken: token,
          password: enteredNewPassword,
          returnSecureToken: false,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then((res) => {
        //Password Save Success
        history.replace("/");
      })
      .catch((err) => {
        //Error in Saving password.
      });
  };

  return (
    <form className={classes.form} onSubmit={submithandler}>
      <div className={classes.control}>
        <label htmlFor="new-password">New Password</label>
        <input
          type="password"
          id="new-password"
          minLength="7"
          ref={inputNewPasswordRef}
        />
      </div>
      <div className={classes.action}>
        <button>Change Password</button>
      </div>
    </form>
  );
};

export default ProfileForm;
