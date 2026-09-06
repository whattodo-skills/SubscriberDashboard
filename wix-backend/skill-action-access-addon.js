// Add this export to the deployed backend/skillProgress.web.js, which already
// imports Permissions, webMethod, and getCurrentEntitlement.
export const getSkillActionAccess = webMethod(Permissions.Anyone, async () => {
  try {
    const entitlement = await getCurrentEntitlement();
    if (!entitlement.loggedIn || !entitlement.memberId) {
      return {
        status: 'signedOut',
        canSaveToSkillsStack: false,
        canAskTerriBot: false,
        message: 'Sign in to check access to Skills Stack and TerriBot.'
      };
    }
    if (!entitlement.paid) {
      return {
        status: 'free',
        canSaveToSkillsStack: false,
        canAskTerriBot: false,
        message: 'A qualifying paid subscription is required for Skills Stack and TerriBot.'
      };
    }
    return {
      status: 'paid',
      canSaveToSkillsStack: true,
      canAskTerriBot: true,
      message: 'Paid account access confirmed.'
    };
  } catch (error) {
    return {
      status: 'error',
      canSaveToSkillsStack: false,
      canAskTerriBot: false,
      message: 'We could not check your account access. Please reload or try again.'
    };
  }
});
