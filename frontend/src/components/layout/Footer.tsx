import { Row, Col } from "antd";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { Logo } from "../ui";

export default function FooterSection() {
  const t = useTranslations("home");

  return (
    <footer id="contact" className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4">
        <Row gutter={[48, 48]}>
          <Col xs={24} md={8}>
            <Logo variant="light" size="medium" showText={true} />

            <p className="text-gray-400 mt-2.5 mb-4">
              {t("footer.description")}
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-gray-400 hover:text-white transition">
                Facebook
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition">
                Twitter
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition">
                Instagram
              </a>
            </div>
          </Col>

          <Col xs={24} sm={12} md={5}>
            <h3 className="text-lg font-bold mb-4">{t("footer.products")}</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/doctors"
                  className="text-gray-400 hover:text-white transition"
                >
                  {t("footer.findDoctor")}
                </Link>
              </li>
              <li>
                <Link
                  href="/register"
                  className="text-gray-400 hover:text-white transition"
                >
                  {t("footer.register")}
                </Link>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition"
                >
                  {t("footer.mobileApp")}
                </a>
              </li>
            </ul>
          </Col>

          <Col xs={24} sm={12} md={5}>
            <h3 className="text-lg font-bold mb-4">{t("footer.support")}</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition"
                >
                  {t("footer.helpCenter")}
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition"
                >
                  {t("footer.faq")}
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition"
                >
                  {t("footer.contact")}
                </a>
              </li>
            </ul>
          </Col>

          <Col xs={24} sm={12} md={6}>
            <h3 className="text-lg font-bold mb-4">{t("footer.legal")}</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition"
                >
                  {t("footer.terms")}
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition"
                >
                  {t("footer.privacy")}
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition"
                >
                  {t("footer.cookies")}
                </a>
              </li>
            </ul>
          </Col>
        </Row>

        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
          <p>{t("footer.copyright")}</p>
        </div>
      </div>
    </footer>
  );
}
