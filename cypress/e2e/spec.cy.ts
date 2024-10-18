describe("로그인 페이지 테스트", () => {
  it("로그인 성공.", () => {
    cy.intercept("/dashboard*").as("dashboard");

    cy.visit("http://localhost:3000/login");

    cy.get('input[placeholder="이메일"]').type("qq@naver.com");
    cy.get('input[placeholder="비밀번호"]').type("012345678");
    cy.contains("로그인").click();

    cy.wait("@dashboard").then((_) => {
      cy.contains("대시보드");
    });
  });
  //   it.only("로그인 실패.", () => {
  //     cy.visit("http://localhost:3000/login");

  //     cy.get('input[placeholder="이메일"]').type("wrong@naver.com");
  //     cy.get('input[placeholder="비밀번호"]').type("wrongnumber");
  //     cy.contains("로그인").click();

  //     cy.wait("@dashboard").then(() => {
  //       cy.contains("대시보드");
  //     });
  //   });

  //   it("로그인 실패.", () => {
  //     cy.intercept("/login").as("login");

  //     cy.visit("http://localhost:3000/login");

  //     cy.get('input[placeholder="이메일"]').type("wrong@naver.com");
  //     cy.get('input[placeholder="비밀번호"]').type("wrongnumber");
  //     cy.contains("로그인").click();

  //     cy.wait("@login").then(() => {
  //       cy.contains("로그인에 실패했습니다. 다시 시도해 주세요.").should("be.visible");
  //     });
  //   });
});
