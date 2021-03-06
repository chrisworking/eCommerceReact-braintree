import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import styled from "styled-components";
import Layout from "../layout/Layout";
import {
  Button,
  Form,
  Grid,
  Header,
  Message,
  Segment,
  Container,
  Divider,
  Checkbox
} from "semantic-ui-react";

/**custom imports */
import { UPDATE_USER, RESET_FLAGS } from "../store/actions/authAction";
import DashboardLayout from "../layout/DashboardLayout";
import { mediaUI as media } from "../utils/mediaQueriesBuilder";
import useForm from "../common/hooks/useForm";
import { validateUpdateProfile } from "../common/validation/validate";
import { ButtonContainer } from "../common/components/customComponents";
/**
 * Styling elements with styled-components
 * Semantic UI modified elements' name will end with 'UI'
 */

const FormFieldUI = styled(Form.Field)`
  width: 100%;
  margin-top: 1rem !important;
  ${media.large` width: 20%; `}
  ${media.wide` width: 15%; `}
`;

const CheckboxUI = styled(Checkbox)`
  margin-top: 1rem;
  ${media.large` margin-top: 2rem; `}
`;
const FormInputUI = styled(Form.Input)`
  margin-top: 1rem !important;
  ${media.large`margin-top:0 !important; `}
`;
const initialState = {
  name: "",
  email: "",
  password: "",
  street: "",
  city: "",
  state: "",
  zip: "",
  country: ""
};

const Profile = props => {
  const { handleChange, handleSubmit, setValues, values, errors } = useForm(
    submit,
    initialState,
    validateUpdateProfile
  );
  const dispatch = useDispatch();
  const { user, token, success, error, address: storedAddress } = useSelector(state => ({
    ...state.authReducer
  }));

  const { _id: userId, email: userEmail, name: userName, role } = user ? user : null;

  const [updatePassword, setUpdatePassword] = useState(false);
  const { name, password, street, city, zip, country, state } = values;

  useEffect(() => {
    if (userId !== props.match.params.userId) props.history.push("/home");
    else {
      if (storedAddress) {
        var { _id: addressId, ...address } = storedAddress;
        setValues({ ...values, email: userEmail, name: userName, ...address });
      } else setValues({ ...values, email: userEmail, name: userName });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    return () => {
      resetFlags();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const resetFlags = () => {
    dispatch({
      type: RESET_FLAGS
    });
  };

  async function submit() {
    let { email, name, password, ...updatedAddress } = values;
    let updatedUser;
    if (password) updatedUser = { name, password, address: updatedAddress };
    else updatedUser = { name, address: updatedAddress };

    dispatch({
      type: UPDATE_USER,
      payload: {
        user: updatedUser,
        userId,
        token
      }
    });
  }

  const showSuccess = () => (
    <Message color="green" style={{ display: success ? "" : "none", fontSize: "1.3rem" }}>
      Your Account has been Updated
    </Message>
  );

  const showError = () => (
    <Message color="red" style={{ display: error ? "" : "none", fontSize: "1.3rem" }}>
      {error}
    </Message>
  );

  const toggle = (e, { checked }) => {
    if (!checked) {
      setValues({ ...values, password: "" });
    }
    setUpdatePassword(!updatePassword);
  };

  const goBack = () => (
    <ButtonContainer>
      <Button
        fluid
        as={Link}
        to={`${role && role === 1 ? "/admin/dashboard" : "/user/dashboard"}`}
        color="red"
        icon="left arrow"
        labelPosition="right"
        style={{ marginBottom: "1rem" }}
        content="Back to Dashboard"
      />
    </ButtonContainer>
  );

  const profileForm = () => {
    return (
      <Form size="large" onSubmit={handleSubmit} onChange={resetFlags}>
        <Segment stacked>
          {showError()}
          {showSuccess()}

          <Grid>
            <Grid.Row>
              <Grid.Column mobile={16} computer={6}>
                <Form.Input
                  fluid
                  label="Name"
                  placeholder="Name"
                  name="name"
                  value={name}
                  onChange={handleChange}
                  error={errors && errors.name && errors.name}
                />
              </Grid.Column>
              <Grid.Column mobile={16} computer={4}>
                <CheckboxUI
                  toggle
                  label="Update Password"
                  name="updatePassword"
                  onChange={toggle}
                  checked={updatePassword}
                />
              </Grid.Column>
              <Grid.Column mobile={16} computer={6}>
                <FormInputUI
                  fluid
                  label="Password"
                  disabled={!updatePassword}
                  placeholder="Enter password to update"
                  type="password"
                  name="password"
                  autoComplete="new-password"
                  value={password && password}
                  onChange={handleChange}
                  error={errors && errors.password && errors.password}
                />
              </Grid.Column>
            </Grid.Row>
          </Grid>

          <Form.Group>
            <Form.Input
              width={12}
              fluid
              label="Street"
              placeholder="Street"
              name="street"
              value={street}
              onChange={handleChange}
              error={errors && errors.street && errors.street}
            />
            <Form.Input
              width={4}
              fluid
              label="City"
              placeholder="City"
              name="city"
              value={city}
              onChange={handleChange}
              error={errors && errors.city && errors.city}
            />
          </Form.Group>
          <Form.Group>
            <Form.Input
              width={6}
              fluid
              label="State"
              placeholder="State"
              name="state"
              value={state}
              onChange={handleChange}
              error={errors && errors.state && errors.state}
            />
            <Form.Input
              width={6}
              fluid
              label="Country"
              placeholder="Country"
              name="country"
              value={country}
              onChange={handleChange}
              error={errors && errors.country && errors.country}
            />
            <Form.Input
              width={4}
              fluid
              label="ZIP/Post Code"
              placeholder="ZIP/Post Code"
              name="zip"
              value={zip}
              onChange={handleChange}
              error={errors && errors.zip && errors.zip}
            />
          </Form.Group>

          <Form.Group>
            <FormFieldUI>
              <Button
                icon="edit"
                labelPosition="right"
                fluid
                color="blue"
                size="large"
                type="submit"
                content="Update"
              />
            </FormFieldUI>
            <FormFieldUI>
              <Button
                as={Link}
                to={`${role && role === 1 ? "/admin/dashboard" : "/user/dashboard"}`}
                icon="x"
                labelPosition="right"
                fluid
                color="red"
                size="large"
                content="Cancel"
              />
            </FormFieldUI>
          </Form.Group>
        </Segment>
      </Form>
    );
  };

  return (
    <Layout isDashboard={true}>
      <DashboardLayout>
        <Container fluid style={{ marginTop: "2rem" }}>
          <Header as="h1">Updating details</Header>
          <Header as="h2"></Header>
          <Divider style={{ marginBottom: "2rem" }} />
          {goBack()}
          {profileForm()}
        </Container>
      </DashboardLayout>
    </Layout>
  );
};
export default Profile;
