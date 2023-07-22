function skillsMember() {
  const member = document.querySelector(".member");
  const memberSkills = document.querySelector(".member__skills");
  const memberSkillsClose = document.querySelector(".member__skills-close");

  member.addEventListener("click", () => {
    memberSkills.classList.add("member__skills--active");
  });

  memberSkillsClose.addEventListener("click", () => {
    memberSkills.classList.remove("member__skills--active");
  });
}