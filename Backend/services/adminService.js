async function createUser({ full_name, username, password, role, organisation_id }) {
  // Check if organisation exists first
  const { data: org } = await supabase
    .from('organisations')
    .select('*')
    .eq('organisation_id', organisation_id)
    .single();

  if (!org) throw new Error('Organisation does not exist');

  const password_hash = await bcrypt.hash(password, 10);

  const { data, error } = await supabase
    .from('users')
    .insert([{ full_name, username, password_hash, role, organisation_id }]);

  if (error) throw new Error(error.message);
  return data;
}
