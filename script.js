// Manipulações simples de UI: menu mobile, scroll suave, validação de formulário e voltar ao topo.

document.addEventListener("DOMContentLoaded", () => {
  const nav = document.querySelector(".nav");
  const navToggle = document.querySelector(".nav-toggle");
  const navLinks = document.querySelectorAll(".nav__link");
  const backToTopBtn = document.querySelector(".back-to-top");
  const contactForm = document.getElementById("contactForm");
  const successMessage = document.getElementById("formSuccess");
  const yearSpan = document.getElementById("year");

  // Atualiza ano automático no footer
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }

  // MENU MOBILE
  if (nav && navToggle) {
    navToggle.addEventListener("click", () => {
      const isOpen = nav.classList.toggle("nav--open");
      navToggle.classList.toggle("nav-toggle--open", isOpen);
      navToggle.setAttribute("aria-expanded", String(isOpen));
    });

    // Fecha o menu ao clicar em um link
    navLinks.forEach((link) => {
      link.addEventListener("click", () => {
        if (nav.classList.contains("nav--open")) {
          nav.classList.remove("nav--open");
          navToggle.classList.remove("nav-toggle--open");
          navToggle.setAttribute("aria-expanded", "false");
        }
      });
    });
  }

  // SCROLL SUAVE para links internos
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (event) => {
      const targetId = anchor.getAttribute("href");
      if (!targetId || targetId === "#") return;

      const targetElement = document.querySelector(targetId);
      if (!targetElement) return;

      event.preventDefault();

      const headerOffset = document.querySelector(".header")?.offsetHeight || 0;
      const elementPosition = targetElement.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset + 4;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    });
  });

  // BOTÃO VOLTAR AO TOPO
  const toggleBackToTop = () => {
    if (!backToTopBtn) return;
    const threshold = 350;
    if (window.scrollY > threshold) {
      backToTopBtn.classList.add("back-to-top--visible");
    } else {
      backToTopBtn.classList.remove("back-to-top--visible");
    }
  };

  window.addEventListener("scroll", toggleBackToTop);

  if (backToTopBtn) {
    backToTopBtn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  // VALIDAÇÃO BÁSICA DO FORMULÁRIO DE CONTATO
  if (contactForm) {
    contactForm.addEventListener("submit", (event) => {
      event.preventDefault();

      // Limpa mensagens anteriores
      clearErrors(contactForm);
      if (successMessage) {
        successMessage.textContent = "";
      }

      const formData = new FormData(contactForm);
      const nome = (formData.get("nome") || "").toString().trim();
      const telefone = (formData.get("telefone") || "").toString().trim();
      const email = (formData.get("email") || "").toString().trim();
      const mensagem = (formData.get("mensagem") || "").toString().trim();

      let isValid = true;

      // Nome: mínimo 3 caracteres
      if (nome.length < 3) {
        setFieldError("nome", "Informe seu nome completo.", contactForm);
        isValid = false;
      }

      // Telefone: validação simples (mínimo de dígitos)
      const digitsPhone = telefone.replace(/\D/g, "");
      if (digitsPhone.length < 10) {
        setFieldError("telefone", "Informe um telefone válido com DDD.", contactForm);
        isValid = false;
      }

      // E-mail: regex simples
      const emailPattern =
        /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
      if (!emailPattern.test(email)) {
        setFieldError("email", "Informe um e-mail válido.", contactForm);
        isValid = false;
      }

      // Mensagem: mínimo 10 caracteres
      if (mensagem.length < 10) {
        setFieldError(
          "mensagem",
          "Conte um pouco mais sobre como podemos ajudar.",
          contactForm
        );
        isValid = false;
      }

      if (!isValid) {
        return;
      }

      // Simulação de envio bem-sucedido (apenas front-end)
      contactForm.reset();
      if (successMessage) {
        successMessage.textContent =
          "Mensagem enviada com sucesso! Entraremos em contato em breve.";
      }
    });
  }
});

/**
 * Exibe a mensagem de erro em um campo específico do formulário.
 */
function setFieldError(fieldId, message, formElement) {
  const field = formElement.querySelector(`#${fieldId}`);
  const group = field?.closest(".form__group");
  const errorElement = group?.querySelector(".form__error");

  if (field) {
    field.classList.add("error");
  }
  if (errorElement) {
    errorElement.textContent = message;
  }
}

/**
 * Limpa os erros visuais e mensagens do formulário.
 */
function clearErrors(formElement) {
  const inputs = formElement.querySelectorAll(".form__group input, .form__group textarea");
  const errors = formElement.querySelectorAll(".form__error");

  inputs.forEach((input) => input.classList.remove("error"));
  errors.forEach((error) => (error.textContent = ""));
}
