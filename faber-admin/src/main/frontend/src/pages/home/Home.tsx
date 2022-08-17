import React, {useContext} from 'react';
import {FormattedMessage} from "react-intl";
import {UserContext} from "@/layout/UserSimpleLayout";

const Home = () => {
  const { user } = useContext(UserContext);
  return (
    <div>
      <h2>
        <FormattedMessage id="app.hello" />，{user?.name}
      </h2>
    </div>
  );
};

export default Home;
