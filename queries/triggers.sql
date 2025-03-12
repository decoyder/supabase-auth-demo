-- RUN ON SUPABASE SQL EDITOR

-- Creates a function to run when user is authenticated (signed up)
create or replace function public.on_user_signup() 
returns trigger as $$
begin
  insert into public.profiles (id, email, updated_at, first_name, last_name)
  values (
    new.id, new.email, 
    now(),
    NEW.raw_user_meta_data->>'first_name',
    NEW.raw_user_meta_data->>'last_name'
  );
  return new;
end;
$$ language plpgsql security definer;

-- Creates a trigger to run the above function when a new user is authenticated (signed up)
create or replace trigger create_user_profile
  after insert on auth.users
  for each row execute procedure public.on_user_signup();

-- Create a function to delete a user
create or replace function public.on_profile_delete()
returns trigger as $$
begin
  delete from auth.users where id = old.id;
  return new;
end;
$$ language plpgsql security definer;

-- Creates a trigger to run when a profile is deleted
create or replace trigger delete_auth_user
  after delete on public.profiles
  for each row execute procedure public.on_profile_delete();