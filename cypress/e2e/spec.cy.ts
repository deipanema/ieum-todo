describe("로그인 페이지 테스트", () => {
  it.only("로그인 성공.", () => {
    cy.visit("http://localhost:3000");
    cy.contains("로그인");
  });
  it("로그인 실패.", () => {
    cy.visit("https://example.cypress.io");
  });
});
