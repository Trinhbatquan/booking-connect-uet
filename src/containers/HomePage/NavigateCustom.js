import { AiFillHome } from "react-icons/ai";
import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { path } from "../../utils/constant";

const NavigateCustom = ({ texts }) => {
  const length = texts?.length;
  const { t } = useTranslation();

  return (
    <div
      className="navigate-custom-container flex items-center justify-start gap-1"
      style={{ padding: "10px 15%" }}
    >
      <NavLink to={path.HOMEPAGE}>
        <AiFillHome className="text-xl text-purple-500" />
      </NavLink>
      <span className="text-xl text-purple-500">/</span>
      {texts?.length > 0 &&
        texts?.map((text, index) => {
          return (
            <div
              key={index}
              // to={`${path.HOMEPAGE}/${link}`}
              className="text-xl text-purple-500"
            >
              <span key={index}>{t(text)}</span>
            </div>
          );
        })}
    </div>
  );
};

export default NavigateCustom;
