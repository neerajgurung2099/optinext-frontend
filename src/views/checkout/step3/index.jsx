import { CHECKOUT_STEP_1 } from "@/constants/routes";
import { Form, Formik } from "formik";
import { displayActionMessage } from "@/helpers/utils";
import { useDocumentTitle, useScrollTop } from "@/hooks";
import PropType from "prop-types";
import React from "react";
import { Redirect } from "react-router-dom";
import * as Yup from "yup";
import { StepTracker } from "../components";
import withCheckout from "../hoc/withCheckout";
import CreditPayment from "./CreditPayment";
import PayPalPayment from "./PayPalPayment";
import Total from "./Total";
import { useDispatch, useSelector } from "react-redux";
import firebase from "@/services/firebase";
import { clearBasket } from "@/redux/actions/basketActions";
import { resetCheckout } from "@/redux/actions/checkoutActions";
import { history } from "@/routers/AppRouter";
const FormSchema = Yup.object().shape({
  type: Yup.string().required("Please select payment mode"),

  name: Yup.string().when("type", {
    is: "credit",
    then: (schema) =>
      schema
        .min(4, "Name should be at least 4 characters.")
        .required("Name is required"),
    otherwise: (schema) => schema.notRequired(),
  }),

  cardnumber: Yup.string().when("type", {
    is: "credit",
    then: (schema) =>
      schema
        .min(13, "Card number should be 13-19 digits long")
        .max(19, "Card number should only be 13-19 digits long")
        .required("Card number is required"),
    otherwise: (schema) => schema.notRequired(),
  }),

  expiry: Yup.date().when("type", {
    is: "credit",
    then: (schema) => schema.required("Credit card expiry is required"),
    otherwise: (schema) => schema.notRequired(),
  }),

  ccv: Yup.string().when("type", {
    is: "credit",
    then: (schema) =>
      schema
        .min(3, "CCV length should be 3-4 digit")
        .max(4, "CCV length should only be 3-4 digit")
        .required("CCV is required"),
    otherwise: (schema) => schema.notRequired(),
  }),
});

const Payment = ({ shipping, payment, subtotal }) => {
  useDocumentTitle("Check Out Final Step | Salinaka");
  useScrollTop();

  const initFormikValues = {
    name: payment.name || "",
    cardnumber: payment.cardnumber || "",
    expiry: payment.expiry || "",
    ccv: payment.ccv || "",
    type: payment.type || "paypal",
  };

  const dispatch = useDispatch();
  const basket = useSelector((state) => state.basket);
  const user = useSelector((state) => state.auth);
  const onConfirm = async (values) => {
    console.log("herer");
    try {
      const total = subtotal + (shipping.isInternational ? 50 : 0);

      const order = {
        userId: user?.id || null,
        items: basket.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
        })),
        shipping,
        payment: {
          type: values.type, // credit | paypal (demo)
        },
        totalAmount: total,
      };

      await firebase.createOrder(order);

      dispatch(clearBasket());
      dispatch(resetCheckout());

      displayActionMessage("Order placed successfully! (Demo)", "success");
      history.push("/");
    } catch (error) {
      displayActionMessage("Failed to place order. Please try again.", "error");
      console.error(error);
    }
  };

  if (!shipping || !shipping.isDone) {
    return <Redirect to={CHECKOUT_STEP_1} />;
  }
  return (
    <div className="checkout">
      <StepTracker current={3} />
      <Formik
        initialValues={initFormikValues}
        validateOnChange
        validationSchema={FormSchema}
        onSubmit={(values, helpers) => {
          console.log("Formik submit fired");
          onConfirm(values);
        }}
      >
        {() => (
          <Form className="checkout-step-3">
            <CreditPayment />
            <PayPalPayment />
            <Total
              isInternational={shipping.isInternational}
              subtotal={subtotal}
            />
          </Form>
        )}
      </Formik>
    </div>
  );
};

Payment.propTypes = {
  shipping: PropType.shape({
    isDone: PropType.bool,
    isInternational: PropType.bool,
  }).isRequired,
  payment: PropType.shape({
    name: PropType.string,
    cardnumber: PropType.string,
    expiry: PropType.string,
    ccv: PropType.string,
    type: PropType.string,
  }).isRequired,
  subtotal: PropType.number.isRequired,
};

export default withCheckout(Payment);
