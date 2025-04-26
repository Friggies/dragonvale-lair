import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
    'https://evrjimpvbkritkiantsx.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV2cmppbXB2YmtyaXRraWFudHN4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTkyNjAxMDEsImV4cCI6MjAzNDgzNjEwMX0.kU029veAv9sk1klaML-e49jNAFq9US4bZHxCUPVcVKU'
)

export default supabase
