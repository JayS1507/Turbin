use anchor_lang::prelude::*;

declare_id!("GYszdVMFUenxJe9pwt6LcJ2i3EoMBQTi49511LMe2B8a");

#[program]
pub mod test_hello_world {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        msg!("Greetings from: {:?}", ctx.program_id);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
