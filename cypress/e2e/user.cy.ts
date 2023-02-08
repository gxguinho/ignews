describe("Comportamento Usuário", () => {
  
  it("Tentar entra em um post sem estar logado", () => {
    cy.ignews();

    cy.get("#postsLink").click();

    cy.get("#5-ferramentas-em-alta-para-desenvolvedores-react").click();

    expect(cy.contains("Subscribe now"))
  });

  it("Click no post now estando autenticado.", () => {
    cy.ignews();

    cy.contains("Sign in with Github").click();

    cy.origin("https://github.com", () => {
      cy.get("#login_field").type("gabrielapl@unipam.edu.br");
      cy.get("#password").type("gaguinho456");
      cy.get("input").contains("Sign in").click();
    });

    cy.ignews()
    
    cy.contains("Sign in with Github").click();

    cy.wait(2000);

    cy.get("#postsLink").click();
    cy.get("#5-ferramentas-em-alta-para-desenvolvedores-react").click();

    cy.contains("Estamos chegando ao fim de mais um post e dessa vez um pouco diferente trazendo algumas");
  });
}) 