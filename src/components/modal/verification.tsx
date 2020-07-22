import React from 'react';
import Rodal from 'rodal';
import 'rodal/lib/rodal.css';
import '../../assets/style/modal.scss';
import { nexmentConfigType } from 'components/container';
import adminLogin from '../../lib/database/adminLoging';

const VerificationModal = (Props: {
  visibilityFunction?: Function;
  config: nexmentConfigType;
}) => {
  // Modal state
  const [notificationModalStatus, setNotificationModalStatus] = React.useState<
    boolean
  >(true);

  // Admin state
  const [password, setPassword] = React.useState<string>();
  const [loginText, setLoginText] = React.useState<string>('Login');

  // Modal closing event handler
  const handleCloseNotification = () => {
    setNotificationModalStatus(!notificationModalStatus);
    if (Props.visibilityFunction) {
      // Change visibility state in CommentsList
      Props.visibilityFunction(false);
    }
  };

  // Admin event handler
  const handlePwdChange = (e: {
    target: { value: React.SetStateAction<string | undefined> };
  }) => {
    setPassword(e.target.value);
  };

  
  /**
   * Login event handler
   *
   */
  const loginAction = async () => {
    setLoginText('Verifying...');
    const returnData = await adminLogin(
      Props.config.admin.name,
      Props.config.admin.email,
      password || '',
      Props.config
    );
    if (returnData.status !== 200) {
      alert(returnData.msg);
      setLoginText('Login');
    } else {
      setLoginText('Success');
      handleCloseNotification();
    }
  };

  return (
    <Rodal
      visible={notificationModalStatus}
      onClose={() => {
        handleCloseNotification();
      }}
      className="nexment-modal-notification"
      animation="fade"
    >
      <div className="nexment-modal-text">
        <h1>Verification</h1>
        <p>Please verify your Nexment admin identity (first time login password will be set as admin password)</p>
      </div>
      <input placeholder="Admin password" onChange={handlePwdChange}></input>
      <button
        onClick={() => {
          loginAction();
        }}
      >
        {loginText}
      </button>
    </Rodal>
  );
};

export default VerificationModal;
