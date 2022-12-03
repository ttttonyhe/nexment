import leanCloud from './initiation';
import { nexmentConfigType } from '../../components/container';

/**
 * Nexment Admin Login
 *
 * @param {string} name
 * @param {string} email
 * @param {string} pwd
 * @param {nexmentConfigType} config
 * @returns
 */
const adminLogin = async (
  name: string,
  email: string,
  pwd: string,
  config: nexmentConfigType
) => {
  const AV = leanCloud(
    config.leancloud.appId,
    config.leancloud.appKey,
    config.leancloud.serverURL
  );

  const returnJson = await AV.User.loginWithEmail(email, pwd).then(
    () => {
      return {
        status: 200,
        msg: 'Login success',
      };
    },
    async () => {
      if (name && email && pwd) {
        const possibleAdmin = new AV.User();
        possibleAdmin.setUsername(name);
        possibleAdmin.setPassword(pwd);
        possibleAdmin.setEmail(email);
        return possibleAdmin.signUp().then(
          () => {
            return {
              status: 200,
              msg: 'Admin successfully registered',
            };
          },
          () => {
            return {
              status: 500,
              msg: 'Login failed',
            };
          }
        );
      } else {
        return {
          status: 500,
          msg: 'Login failed',
        };
      }
    }
  );

  return returnJson;
};

export default adminLogin;
