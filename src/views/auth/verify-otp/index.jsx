import { ArrowRightOutlined, LoadingOutlined } from "@ant-design/icons";
import { CustomInput } from "@/components/formik";
import { Field, Form, Formik } from "formik";
import { useDocumentTitle, useScrollTop } from "@/hooks";
import PropType from "prop-types";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";

// 👉 you will create this action
import { verifyOtp, resendOtp } from "@/redux/actions/authActions";

const VerifyOtpSchema = Yup.object().shape({
  otp: Yup.string()
    .required("OTP is required.")
    .length(6, "OTP must be 6 digits"),
});

const VerifyOtp = ({ history, location }) => {
  const dispatch = useDispatch();

  const { isAuthenticating, authStatus } = useSelector((state) => ({
    isAuthenticating: state.app.isAuthenticating,
    authStatus: state.app.authStatus,
  }));

  // email can be passed via location.state from signup / login
  const email = location?.state?.email;

  useScrollTop();
  useDocumentTitle("Verify Email | Salinaka");

  useEffect(
    () => () => {
      // cleanup if needed
    },
    [],
  );

  const onSubmitForm = ({ otp }) => {
    dispatch(
      verifyOtp({
        email,
        otp,
      }),
    );
  };

  const onResendOtp = () => {
    dispatch(resendOtp({ email }));
  };

  return (
    <div className="auth-content">
      {authStatus?.success && (
        <div className="loader">
          <h3 className="toast-success auth-success">
            {authStatus.message}
            <LoadingOutlined />
          </h3>
        </div>
      )}

      {!authStatus?.success && (
        <>
          {authStatus?.message && (
            <h5 className="text-center toast-error">{authStatus.message}</h5>
          )}

          <div className={`auth ${authStatus?.message && "input-error"}`}>
            <div className="auth-main">
              <h3>Verify your email</h3>
              <p style={{ marginTop: "10px", fontSize: "1.3rem" }}>
                Enter the 6-digit code sent to <strong>{email}</strong>
              </p>

              <div className="auth-wrapper">
                <Formik
                  initialValues={{ otp: "" }}
                  validationSchema={VerifyOtpSchema}
                  onSubmit={onSubmitForm}
                >
                  {() => (
                    <Form>
                      <div className="auth-field">
                        <Field
                          disabled={isAuthenticating}
                          name="otp"
                          type="text"
                          maxLength="6"
                          label="OTP Code"
                          placeholder="123456"
                          component={CustomInput}
                        />
                      </div>

                      <br />

                      <div className="auth-field auth-action">
                        <button
                          type="button"
                          className="button button-border button-border-gray"
                          disabled={isAuthenticating}
                          onClick={onResendOtp}
                        >
                          Resend OTP
                        </button>

                        <button
                          className="button auth-button"
                          disabled={isAuthenticating}
                          type="submit"
                        >
                          {isAuthenticating ? "Verifying" : "Verify"}
                          &nbsp;
                          {isAuthenticating ? (
                            <LoadingOutlined />
                          ) : (
                            <ArrowRightOutlined />
                          )}
                        </button>
                      </div>
                    </Form>
                  )}
                </Formik>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

VerifyOtp.propTypes = {
  history: PropType.shape({
    push: PropType.func,
  }).isRequired,
  location: PropType.shape({
    state: PropType.object,
  }),
};

export default VerifyOtp;
