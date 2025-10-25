import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import api from '@/lib/api';
import type { LoanType, LoanApplicationRequest } from '@/lib/types';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export function NewLoanApplication() {
  const navigate = useNavigate();
  const [loanTypes, setLoanTypes] = useState<LoanType[]>([]);
  const [selectedLoanType, setSelectedLoanType] = useState<string>('');
  const [amount, setAmount] = useState('');
  const [remarks, setRemarks] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchLoanTypes();
  }, []);

  const fetchLoanTypes = async () => {
    try {
      const response = await api.get<LoanType[]>('/loan-types');
      setLoanTypes(response.data);
    } catch (error) {
      console.error('Error fetching loan types:', error);
    }
  };

  const selectedType = loanTypes.find(lt => lt.loanTypeId.toString() === selectedLoanType);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const request: LoanApplicationRequest = {
        loanTypeId: parseInt(selectedLoanType),
        amount: parseFloat(amount),
        remarks,
      };

      await api.post('/loans', request);
      toast.success('Loan application submitted successfully!');
      navigate('/loans');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to submit loan application');
      toast.error('Failed to submit application');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-2xl">
      <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>New Loan Application</CardTitle>
          <CardDescription>
            Fill in the details to apply for a loan
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="loanType">Loan Type</Label>
              <Select value={selectedLoanType} onValueChange={setSelectedLoanType} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select a loan type" />
                </SelectTrigger>
                <SelectContent>
                  {loanTypes.map((type) => (
                    <SelectItem key={type.loanTypeId} value={type.loanTypeId.toString()}>
                      {type.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedType && (
                <p className="text-sm text-muted-foreground">
                  {selectedType.description} • Max: {selectedType.maxAmount.toLocaleString()} RWF
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">Loan Amount (RWF)</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount"
                max={selectedType?.maxAmount}
                required
              />
              {selectedType && amount && parseFloat(amount) > selectedType.maxAmount && (
                <p className="text-sm text-destructive">
                  Amount exceeds maximum allowed ({selectedType.maxAmount.toLocaleString()} RWF)
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="remarks">Remarks (Optional)</Label>
              <Textarea
                id="remarks"
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                placeholder="Enter any additional information..."
                rows={4}
              />
            </div>

            <div className="flex gap-3">
              <Button type="button" variant="outline" onClick={() => navigate(-1)} className="flex-1">
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={loading || !selectedLoanType || !amount}
                className="flex-1"
              >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Submit Application
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
